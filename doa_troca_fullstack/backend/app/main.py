
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Annotated

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import create_engine, ForeignKey, String, Integer, Boolean, Text, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker, Session

# ---------- Config ----------
DATABASE_URL = "sqlite:///./app.db"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
ALGORITHM = "HS256"
SECRET_KEY = "change-me-in-prod-please"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

# ---------- Models ----------
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[Optional[str]] = mapped_column(String(120), default=None)
    city: Mapped[Optional[str]] = mapped_column(String(120), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    items: Mapped[List["Item"]] = relationship(back_populates="owner")

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)

    items: Mapped[List["Item"]] = relationship(back_populates="category")

class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)
    is_donation: Mapped[bool] = mapped_column(Boolean, default=True)  # True=doação, False=troca
    condition: Mapped[str] = mapped_column(String(50), default="used")  # new, used, refurb
    city: Mapped[Optional[str]] = mapped_column(String(120), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    category_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"), nullable=True)

    owner: Mapped["User"] = relationship(back_populates="items")
    category: Mapped[Optional["Category"]] = relationship(back_populates="items")

class MessageThread(Base):
    __tablename__ = "message_threads"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_a_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user_b_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    item_id: Mapped[Optional[int]] = mapped_column(ForeignKey("items.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    thread_id: Mapped[int] = mapped_column(ForeignKey("message_threads.id"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

class Offer(Base):
    __tablename__ = "offers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    from_user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String(20))  # "donation" ou "exchange"
    message: Mapped[Optional[str]] = mapped_column(Text, default=None)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending/accepted/declined
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

# ---------- Security / Auth ----------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_db_and_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

from sqlalchemy.orm import Session
def get_user_by_email(db: Session, email: str):
    from sqlalchemy import select
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

from fastapi import Body

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: Optional[str] = None
    city: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    city: Optional[str] = None
    class Config:
        from_attributes = True

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str = payload.get("sub")
        if sub is None:
            raise credentials_exception
        user_id = int(sub)
    except (JWTError, ValueError):
        raise credentials_exception
    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user

class CategoryIn(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

class ItemIn(BaseModel):
    title: str
    description: Optional[str] = None
    is_donation: bool = True
    condition: str = "used"
    city: Optional[str] = None
    category_id: Optional[int] = None

class ItemOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_donation: bool
    condition: str
    city: Optional[str]
    category_id: Optional[int]
    owner_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ThreadCreate(BaseModel):
    recipient_user_id: int
    item_id: Optional[int] = None
    first_message: Optional[str] = None

class MessageOut(BaseModel):
    id: int
    sender_id: int
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ThreadOut(BaseModel):
    id: int
    user_a_id: int
    user_b_id: int
    item_id: Optional[int]
    created_at: datetime
    messages: List[MessageOut] = []
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str

class OfferCreate(BaseModel):
    item_id: int
    type: str  # "donation" ou "exchange"
    message: Optional[str] = None

class OfferOut(BaseModel):
    id: int
    item_id: int
    from_user_id: int
    type: str
    message: Optional[str]
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

app = FastAPI(title="GiveMe", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# ---- Auth ----
@app.post("/auth/register", response_model=UserOut, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email já registrado")
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name,
        city=user_in.city,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post("/auth/login", response_model=Token)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Email ou senha inválidos")
    token = jwt.encode({"sub": str(user.id), "exp": (datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserOut)
def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

# ---- Categories ----
@app.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(cat: CategoryIn, db: Session = Depends(get_db), current_user: Annotated[User, Depends(get_current_user)] = None):
    c = Category(name=cat.name, description=cat.description)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@app.get("/categories", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()

# ---- Items ----
@app.post("/items", response_model=ItemOut, status_code=201)
def create_item(item: ItemIn, db: Session = Depends(get_db), current_user: Annotated[User, Depends(get_current_user)] = None):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Autenticação necessária")
    it = Item(
        title=item.title,
        description=item.description,
        is_donation=item.is_donation,
        condition=item.condition,
        city=item.city or current_user.city,
        category_id=item.category_id,
        owner_id=current_user.id,
    )
    db.add(it)
    db.commit()
    db.refresh(it)
    return it

from typing import Optional as Opt
from sqlalchemy import select
@app.get("/items", response_model=List[ItemOut])
def list_items(
    q: Opt[str] = None,
    category_id: Opt[int] = None,
    condition: Opt[str] = None,
    city: Opt[str] = None,
    is_donation: Opt[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Item)
    if q:
        like = f"%{q}%"
        query = query.filter((Item.title.ilike(like)) | (Item.description.ilike(like)))
    if category_id is not None:
        query = query.filter(Item.category_id == category_id)
    if condition:
        query = query.filter(Item.condition == condition)
    if city:
        query = query.filter(Item.city == city)
    if is_donation is not None:
        query = query.filter(Item.is_donation == is_donation)
    return query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()

@app.get("/items/{item_id}", response_model=ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    it = db.get(Item, item_id)
    if not it:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return it

@app.put("/items/{item_id}", response_model=ItemOut)
def update_item(item_id: int, item: ItemIn, db: Session = Depends(get_db), current_user: Annotated[User, Depends(get_current_user)] = None):
    it = db.get(Item, item_id)
    if not it:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    if it.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    for field, value in item.model_dump().items():
        setattr(it, field, value)
    db.commit()
    db.refresh(it)
    return it

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: Annotated[User, Depends(get_current_user)] = None):
    it = db.get(Item, item_id)
    if not it:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    if it.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão")
    db.delete(it)
    db.commit()
    return

# ---- Dev Seed ----
@app.post("/dev/seed")
def dev_seed(db: Session = Depends(get_db)):
    if not db.query(Category).first():
        db.add_all([
            Category(name="Roupas", description="Vestuário em geral"),
            Category(name="Móveis", description="Cadeiras, mesas, sofás..."),
            Category(name="Eletrônicos", description="Celulares, TVs, computadores"),
            Category(name="Livros", description="Livros e materiais de estudo"),
        ])
    if not db.query(User).filter_by(email="demo@demo.com").first():
        db.add(User(email="demo@demo.com", hashed_password=pwd_context.hash("demo123"), name="Demo", city="Santa Rita do Sapucaí"))
    db.commit()
    return {"ok": True}
