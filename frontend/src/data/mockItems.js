// Simples “banco” de itens para testes locais (sem backend)
export const items = [
  {
    id: "1",
    slug: "jeans-slim-fit",
    title: "Slim Jeans",
    type: "Sell", // Sell | Donation | Trade
    price: 120,
    condition: "Used - Good Condition",
    location: "Pouso Alegre, MG",
    category: "Clothes",
    description: "Calça jeans slim, pouco uso, tamanho 40.",
    images: [
      // mesmo base64 que você já usa na Home (ou troque por url)
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhIVFhUX..."
    ],
  },
  {
    id: "2",
    slug: "basic-hoodie",
    title: "Basic Hoodie",
    type: "Donation",
    price: null,
    condition: "Used - Good Condition",
    location: "Pouso Alegre, MG",
    category: "Clothes",
    description: "Moletom básico, confortável. Tamanho M.",
    images: [
      "https://www.vans.com.au/media/catalog/product/cache/6abe8630b46db5a83670874e5572d16c/s/i/site_new_hoodie_images_3_.jpg",
    ],
  },
  {
    id: "3",
    slug: "work-laptop",
    title: "Work Laptop",
    type: "Trade",
    price: null,
    condition: "Needs Repair",
    location: "Pouso Alegre, MG",
    category: "Electronics",
    description: "Notebook para troca, com problema no teclado.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    ],
  },
  {
    id: "4",
    slug: "gaming-mouse",
    title: "Gaming Mouse",
    type: "Sell",
    price: 75,
    condition: "New",
    location: "Pouso Alegre, MG",
    category: "Accessories",
    description: "Mouse gamer 3200 DPI, RGB.",
    images: [
      "https://images.kabum.com.br/produtos/fotos/sync_mirakl/484198/xlarge/Mouse-Gamer-Exbom-Ms-g270-USB-3200-Dpi-RGB-7-Bot-es_1746723083.png",
    ],
  },
  {
    id: "5",
    slug: "mechanical-keyboard",
    title: "Mechanical Keyboard",
    type: "Sell",
    price: 199,
    condition: "New",
    location: "Pouso Alegre, MG",
    category: "Accessories",
    description: "Teclado mecânico ABNT2, switches blue.",
    images: [
      "https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/k/6/k604-br3.jpg",
    ],
  },
];
