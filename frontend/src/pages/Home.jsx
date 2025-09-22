import "../styles/Home.css"
import { FiSearch, FiHeart, FiUser, FiHome, FiShoppingCart } from "react-icons/fi"

function Home() {
  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <h1 className="logo">Give.me</h1>
        <FiShoppingCart className="icon" size={22} />
      </header>

      {/* Search bar */}
      <div className="search-container">
        <FiSearch className="search-icon" size={18} />
        <input type="text" placeholder="What are you looking for?" />
      </div>

      {/* Highlight donation */}
      <section className="highlight">
        <img
          src="https://copilot.microsoft.com/th/id/BCO.f758662b-2439-4b83-bb36-276835cae548.png"
          alt="Top donation"
        />
        <div className="highlight-info">
          <h2>TOP Donations</h2>
          <button>I WANT IT</button>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="chips">
          <button className="chip active">All</button>
          <button className="chip">Smartphones</button>
          <button className="chip">Laptops</button>
          <button className="chip">Clothes</button>
          <button className="chip">Accessories</button>
        </div>
      </section>

      {/* Products grid */}
      <section className="products">
        <div className="product-card">
          <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhIVFhUXGBUYGBcXFhcdGBUYFxUXFhcXFhcYHSggGBolHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0lHR8vNS4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLf/AABEIAQgAvwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAgMFBgcAAQj/xABIEAABAwEEBgUHCQUIAwEAAAABAAIRAwQSITEFBkFRcZEiYYGhsQcTMlLB0fAjQmJygpKywuEUJDRD8RUWM1NzorPSg6PiY//EABkBAAIDAQAAAAAAAAAAAAAAAAIEAQMFAP/EAC4RAAICAQMCBAUDBQAAAAAAAAABAgMRBCExEjITIkFRFCNhcYEFscEVM0KR8P/aAAwDAQACEQMRAD8A2GxOlqIQtgEBFKireCLbO5nq5cuVoBy8c6AScgJ5L1BabqXbPWOOFN+WfonJQ2ct2VFmkmGn5y8IJJl0tGJnMhR2k9KtYwk4DOcCMp9IYKIrh1x04uGUjANnC6NmGB2ztVU0k41KjaTXGHGXHEQ04uF3sjHelIUKT2HZajo5DbVbBVtwrOBNNpIa0jF0t9ODkMepXRl17L0SNkYgcTsy2qoUWNLnONQO3uOBDifnCZ39RUhaNKsZVL6AqU2BrMHkuyPTcR1yeY4B23SRawuUU0/qE4ybe6ZPlpzY4TgBO/4EqKrVLWXSX9GMgMD8SOaA0jp6qanRLAAXDAenBgPDgZggnmmnaXqxMYgdEDKcM52bewKj4Gz6Df8AU6vVMetOj6tQg1Hm60h3ouxukd3xtTto0jaGA3WgyYBuO39eA5oF2m6gALgCMJkfSl20bggq2nK1QYiNpugAQQQcyYwhd8Hb64O/qNGNsjFe32jzrKtYOqBpvXTAEY+iNhA29Ss9a3U61mqPpvBBpv2iZunAjeqbpfzlRrYqEh7S4XXOxbAyED1hzyU2dEfs9nstMO84yo0u6Iuk4tdDsTtdjBzahsocFlnVauNksfuN2cm6xu0Dx/SFcdWWxI+iFB6M0TUvF72xJwG4bByVk0ZTuvj6J8QqE/MgrN4tksuXLkyInqUAkhONC449a1E0gkU2IljFKIZMUmxPPmnF4wJSKK2K3ycuXLkZByj9YXxZ6nXdHNwHtUgorWY/Igb3tHI3vYq7HiD+wdSzNfcrVscBTMjZ7FmTaTXVKlVoABJaI3D0jzw+yrzrbbfN0HnqKpjC1rA2ch37TzU/pteW5exZ+ozwlFepGVKJ84IneYmYGJGHUEbY7Vsc2WnMTgccoPvT9jaAS47cJ3NzII3nBIrgbMMVqdKbMvqwgYtuukY3gMZb6ImAWz0SJI9+aJY2A69s27DllOeaZqUgcwOqQhX0ASRgOid8ZjYIXYwdyKFoB6TpmCQNgxjtK8DRUbD8GmDEmXHbMZ4bMkAyz9IAAgRl0onMwJ61J0sNpQrL5JlhcCiQadO6BgDsg3QJiNk3cuCmND6Ra8UKR9KnUfA3sqC93Fru5RrbSGbJJ2oPRgJrUi1pnzrROyCSM+BS98MxZfp54mjXmURAw2IKyj5V3UPEhH0vR7EDYfTqHh7VkR70a8uxhy5cuTQmKaE/TamqaKYFxzHKYRDGptgRVNqIBkgzJKXBeokAeL1cuUnHihdZnYU2/SLuQj8ymlXNYX/LMGwMn7xM/hCp1DxWy7TLNiM91ytN6pSpTheBPBoLvEBRFWu1rcJJ4AfhjxRmtdmP7VfyaGiBvLpx7IPNRbxCe0FaVKfuLa6b8XHsC+c6jzSS8/HUn3MHH46l5cCcwJ5Bw1xzKVTswJgnYc8sC07x4pZbuKFfbbjiRsae8gbeKhkok6tMBwutJF3fvadpd17kK6UJQ0o55xb1DHqAlFUjgoWDpIV1LxtodTF5glwIOGHomR3hJc/FKYolFNYOi2nlGp6NtorUmvbk5oPMJuwjpP7PaozUqqHUA0GQ0kcNsdkx2KVs4h7+z2rBxi3Bvt9VWQpcvF6mBQcpo2kEDTR1FSiGF0wiGpimiKaJAMNLwCBIk5CcTwC9VV1k0iaNVtRzGloiKgOIx9GMlVdOadfVaKsltVmYAMR6w3bcJ2pazVKG2NwcGpPqNGbgOJG3JKWI0dIXngVHuMmZBcdsRGMHM9q1nQNqFRpLKRY2c3ESXQJwk9W3vlTRqfEeMYOJVVXStS9aH9Qa3kJPeSrUqHarSYfVGJc5xA3yTA9inVPZIb0ccybIDXagAadSMcWz1EE+LQquVYte67gyhII+VIM5j5N5g7slWnPWjoH8n8iP6gsXfgbrPOwIdznFEPTTk4JDBYd6ZNJgdi4gXHGRngQUU4JdMRPAxxkQglnAUeQWzWVocTkB1zu4fARYKQKZiC7DdOewYwNicYyFMVsdJ5Y3UjNOUDKQQlU8FxBadQrU1hqUycJvb4LpnDZkrPZqgc5xBmYMRsx25bVUfJ1YGipaHAuklsA7JaZIIxxjxVms8tqQXOIxGJnHZ4LEvaV7NylN0fgkVy8XqMoHKaOoIGmjqKJEMMpoliGpommiQDKhrlo1zKTnMoNFJpvekC4HbdAOW2OPBZraba6o64B0SDIEeJxnitNtOhqNY3qj6hOM/L1NuYi93KJfqHo8GQxwnMiq4TjOO/FZc41zl1Fz0sn6kDqpo2+ZDahw6Ra0O6AOPUJlswco3rabO1oY0MwbAu8IwWc2fRVGy40KtVm26K77s/VBhaFY3O82y96V0TxhM6SKjnfJXOpwW4Qsz1hotrU7RTpvLAXGC4EGmb2e8QRK0dzlCawaI8+LzD04gg+i9vqncetX2xckmvQs081GW/DM809YLU6yB1qHytJzC8kjpODrpe2MCHAkyN+/BVsqc1pfVDWUaj3NawwKZkEAQ5rZ+ewFsicp3QFX0/o1iD+rFdc31rPoj0lNVCG5lLcm7gTYkMOrk5Apo13SJjZ4hOWi0NaDGJ3KznU11TQrbS8RXFQ2gEYE0TDLhj5t0Cp/Uqqyaj+Q4RyVm67MFKa9yaYSMuRRTKoOBwKsAOB3p6kE0CnGuUHEzqNayy2Pp5h9O92sdAj7/crZRf5w1BkWOA/2h096o2r14W6kW7W1AevC9HNo5K2aNd8tXkiSxhcAfRJLwAeuGz2hY2sh8zJuaF5qwydpukApQTNkPQZ9VvgE8pXBS+R2mjaKBYjaBRIFhtNE00LTRNNEgCItFOKjx9Innj7U1VYF5pDSVF9QOZVY4OHzXNOIw2HdCU97Lsysu2DjNo065ZimA2egHVqbfpDkMT3BXN5VT1eqtfXc8EQwEY4YuwwnPCeasj7Q3aQO0JzTLEBXVbzx7Hr3Jk1ULaNI0xm7kCRzATFlt1OqL1J7Xt3tM89yvyL4ZD+UNodZQ6BIqNxjGC14jvWXk+1alrsJsb+pzD/vA9qyxxxT2mfkFL+48TNXERMDqTqRUbCvKCOdQxDWiXOwHWTgO9fSVKxtbSbQiWNYKcb2htyOSwXVWzCrpCys2edY48GdM/hX0C4pS97oZpWx8+6fsH7PaKlJ3zXGDvGYPaEI0b1ffKzo2H07QBg4XHfWGLTyw7FQWiEzXLqimUzXS8DrUtrt6balgogB+naH03NqUovtIu3spd0cY2dJXXQ+iSxhBJLn41amRfOxvV3KoaIPytPqe3xC0tIauOZI0dJa4waRzQAABkMEoFeL0BLlgtpRlAoJqMs5XIhh9NFU0JSKKpI0AzF7NpCm0kvbRkgwWUiw8HXC2QpDRGt7LPTNNrGxMi6HwJiZ84XHYqZV0nQ/zZ4NchamkqPrO7GH2qiWovksP9jQWnojv/JolXyiHJrPDwuoSpr3Xd6LiODWe5Z8/StIbKh+zHiU2dPtGVJ54kD2IVK1nNUov1bWq0PEGo4g7MI8EFTtTm1KAabrZdIbgDhGMcVTP7wVTgyiOTipjR9SuXMq1XPF35gbDYPxtXTeF5mRXHL8qNl1qxsdbg08ntWUkYq62vWmjaLPVptvNeWzdcM4IOBGCpTlp6SSlDKMnVwcZ4Z5KaqJ4hNvTQqSfk5pzpOh1Gof/VUW6OWP+SehNuc71aTz2lzG+BK2ApG7uHKu0r+umjv2iyVWD0gL7frMx7xI7ViDDyK+iKiwjWCw+YtNakMmvMfVPSb3OCs00uUV3r1A16wpLF7kmhcKslW64HcR4rUwFlNAjctVsmLGH6LfAJPVLhjWmfIqFwCWQvEoNnBFWdDgImgFKIYdSRNJDUkUxEgGYW7Vezj53h7027QFnG3vHvU9aKEbZ2YDHkhKlhecqdT7hWfu+GayUVzgiv7Ms42Du96UKNnGTBy/RFu0TVP8up90e9cNB1z/AC3f7B+ZR0sLqgvYDqWxjBgwfHYEK/WN4MNa0fZ95KlamrNod8wDi8eyVH6V1WqUKRqvdTwcxt0Fxxe8NGMCM9xRxrXsVStXCYqnbHvOO0GYgTgc4Xkynaug7VRF+r5rzYjBrnEySAM2hMBbOkSUNjF1bbnuOFsiUy4pxrk1UKaFS6+SNvy9oduptHN8/lWo3lmXknHStJ6qXjUWjB6zrX52O19op5WW+VCy3bQyqBg9kHiw+5zeS017lTfKZZb1mFQZ03jk7onvurqZYmjrFmLMya6cUpqbpmEtaAkKDyCtY0Qb1Ckd9Nh/2hZXSdC1DVmrfs1M7hd+6S0dwCW1S8qGNM/Mw8hJhPEJACRHD1jURTCbphPMClEBNJE00PSCIpogWYo+0u2lW7R9QupU3OzLWk9oCo0XnNYPnEN5mFfwIwGSTqQ/e90KlepC5WoXFSoTXL+Fd9ej/wAzFMqH1u/hX/Wpf8rFz4CjygvTrZs9SNjb33SHexUWCr9pL/BqfVPgqGR8cU/o5cxEdVHiR2B2YpNTvSnJDgnBMvXkqZFO0OjN7R91s/mV8D1SPJoYo1f9T8jVcbyzre9j9Xahxz0HpWzCtRqUjHSaRjv2HsMFPOKReQZwHgxA0cYOYwPEYL1TWttk81a6gA6LyHj7Qx75UO6ntWnF5SZnSWHg8CvHk50hebVokEFpDhO44HkQOapTW4qyakOu2tp9Zr2HleE9rBzVdyzBh1PE0aGQkwni1JhZw+dTCfa1NMCJapIYtiIpodiIpqSDEtBUr1oZ9GXchh3kK5yqtqqyalR24AczP5VZryXrWw3a8yFylBNSlNcjKxRUTrV/DP40/wDkapZxUTrP/DP4s/G1DLhhQ7kGaQPyL/q+5UZ+fYPAK8aTPyDuA8QqRaPSw2NZ+ESm9H3v7C2q/tr7nNOEbU28JUEJLloGcXrycO+Qf/qH8LFbQ5U/yfn5B/8AqfkarW1yzbX52aFa8qH5SF5eSZVeSzBU/KJZfk2VhmHXDwdJHeO9UucAtP1ls3nbLWaMw28OLCH/AJVlcp/TvMBK9YkPBGaKqGnWp1W/Ne0nhOMoOE9QzwzV7WUUp4ZszgkEJOjqt+jTf6zGntgT3p0hZbRop5EAJ9qZCfaoOYpiIYUw1PMUkGT6tU4pud6zj3AD3qZBQWiWXaLB1T97pe1GFUxWwxKWWLlepprk5eUgilG6yj92fxZ+NqkA5Aaxn92fxZ+NqiXDCh3IJ0qPkHcG/iaqhpCzhjhgReZTdxljZ7wVcNL/AMO7gz8bVB6yUOhZn/8A5tbyaCPEpjSvFv3RTqVmr8kKBCblPTgmy3FaZmFz8n/+FUH055tHuVrVS8n2VYddM/j9yt8LMuXnZoVdiEheFLAXXVUWCqTVkOkrL5qtUpkei5wHAGAtiphZz5QLNctV4fzGNd2joHwCa0zw8C+oWVkr6cpnEJsJbU6Jmr6o1b1lp9V4cnEjuKlnBVvye1JoPbufPNo/6qzvCzbFiTH635UMwltC8ISmoAmKCeYmU6wqTjN2P2J2+o5loafnDmnm1RvVRe0EFyU16YvpTSuJCGuQWsDv3d3Fn42opqD1gP7u7iz8bUMuGTHuQbpc/u7vsfjahdYac2OmfV83yLI9oRGmf4d32PxtTmmqc2I4TDGHkWq2l4sQFyzV/spTTgulJplLJWsZBb/J5/P/APH+f45q4EKm+Ts9KuOqnxzerrCzru9j9PYhtcV6QvCqi0fpFVfyiWK/QZVAxpux+q7CTwIHNWamm9J2Xz1GpS9drgOMYHnCshLpkmBOOY4MdppbAkhsGDn8e5PDBaRnF38nFaHVWb2tdyMfmV3cFnGoVWLUB6zXDuvflWkuCRvWJjlL8oy5eNSnpAKoLhacYU1KcYVJB8xNtDx848inW6RqD56kzoEb6g7W+5JOgzse7tbPhCVdY74qBGaZrDJ3eUSzWGuNpSDoV3rjtZ+qSdCVNlw9pHsXdDJ8SIfT1qqjPwCffrG+sPNuGBIxjcZ9ijhq/af8o8z7YXrNF16bg59J7WgjExGOGcoWpIKLi2WI6yGs3zRaBeIx4EH2I12tTKlM0S2JaGyDjuVYsVjqsqNL6VRok4uYQMjthIszmNqNNQOuggmBBgbpwURlNSRMoQcA9g+DmlHJH6P0e20AGjaKboiQ83XjMdIRnwUh/d4CfO1QANjGucSN2WC3fGhjOTC8GecYY/qNbadF1U1HBt4MAwOMF84jirf/AG3Z/wDNaOJjxWe2+tSA81SYQAZL3EXnGN2zsUe5x3n47Sse/U/MfTwa9Gl+Wurk1MaSonKqw/aCWLQ05OB7Qslc87zy/RNPruG0d3tVfxD9ix6Ve5s9JyeaVjlm0jUGT44H3FSNLTdcZVH/AHne1T8SvYH4R+jHtb9H+atLzsf8o3gfSHY6e5RNNsqZfpbzwDa7S+Dg68ARvExkpix6MoRPmw76znHuELRq1tbis8iFmhtUtlsRGrBLbTSLQTDmzG4kBxPYVq5VIZbTQc261jWNnotYADx2o4a3b2N5keIS92rrlIur0dsUWOomgoH+9jDm3kQvW6z0jvHL3qtX1v1D8CxehPhLBUNT0/RPzjyKfZpmif5g7f1RqyL9QHVNejMRp6wUPUqg8G/9k+zTlI7anIe9BvoVLIcGirROz5zfd4cFPaK8zX9BrSRnLWy2dhByKB5LNgWjpWgfSe4fYn2qSbpyzgdBzp33SPASeaL/ALIpDEMYeLW+5eU9G0pnzVMcWiOSjcnyhFDTNnIHSundDoPcg9PW+m+ldY9plzIb0pMGTmIGXcjW6Mo+ozsBnsAQun9FMp0r4bBDmxgdpjehecBR6epEnp1rxRN6pPo4ADHHqRIsZLQZviB17EzrDWmg5vDuUnZqAza2piBhjA+N6JdxEuxfd/wAU6MGQ2IjIQO0nJStehebiRznuEpu2dFpkQSDEnq3BeWR95glBNbltLyiJoav0XlznAkzsJae4r06o0j6L3j7RPinjULa7b03DIJGYPzTwzHEhS37WwYC8fjqRRSaKpuUZbMrtXU3dWf2tb7kFX1OrDFtSfsT4FXUDe2O2U610Yg9n9VPhx9gfFn7lFseqlZ2HnWH7Lvenaup9pGQoH7ZB72K0vrVCSfk2z149WWaQS/1i7HJrY70Lph7BK+fuVQaDtDf5JP1KjP+wVi0RSfdAc2CMwSJHETmpWhXag7NX+UPXiglXGPBdXbOXIJpWiQCTAABMmNnVtVe/aWeu3nHtCs1tcbwI2EHvU/W0fSqC9DXdeBQqlTClc6zNqtUHaPjtKGdwHd/1V/tWg6B/ksPY1Rr9WLOTi1jfql09xXfDfUj4r6FTa7jz/8ApPMedhd8cJVno6o2bEk1Y2EPcO0AyvX6kUjjTtFYdRLD4tXfDy9yVqo+xmlOg9wLamMnIk8inqGizTl1FoY/YW4TjMbiD1qafYJMOz3o6jTYwQI7TjzJTHSLeIwCm+tEOxMAHIeCdp0nZXc+v9VLUKc5HkuOjsZBM/G9D0fULxfogWzUqgOFPHtnxRNtNWszzT2OIkHAGcMRipGyMN3pOjcIlyJFBu28eOC7w37s7xkv8UV/S1pqeac1zHAGZJG0CRjGWasjntyDnHtwQOs1ju2YkAAEjIzmDtRoplxuxPDNdFNNkWSUoppY/wCQqWuwIQ9hHR5ourZ3MaSRkD+iYsjIACG18B6f1BrTSvPaAASSIBywIOPVgibY2pT9Jrbu9jYA5YjtXjOjVa7cT3ghP23SJaIAk7tnb1Iq+AL+46y2guwkEdexEPs7HGSfFRFCjVdkAJ2DLuUlZ9HVD6Rw4nHgrCkdZSpNIkniApanQpuGAaR1bEIwD0C0CO5Dur02EjznVHvUohnlazNBdEuwMHr9qhtHukNJEOjEbiMwpp1q9Sm49cYc0NarPdfJiXNDjGWP9FVYvUYplvgBtu9SFJ7D0qbiHbgCPgKOtxwRdjtDAwQ3E4k4oanuw9Qtkwt9WcxJ6yl0qBMw1o4AT2Iena5OAHDBSVCmCZBx61chUEaxzcM+Oa9NUZGm93DLmpRwMQRKHFkecZI5D3qcEZKCNGUzheqPJwguz5ZBFVNChkQwRxJ5kqZ/skDFk8PcjKdM3cbvUXe7auJIax2KBDZ4KQbY/WIHGEoWQD0qx4Nw9qVUsADC5tNx3ScT1gDNccOUaDfmkHh+iDtlndOPYR7kRo63gAMcI3Ee33o+0UyQQ2Md8n+q44g69kNdhoucWskGRngpW+ymNjeJEnjJxTLdE1D6VV0bmi7zzSamjaTY6AO8mXHqm9s612Nzs7YF16t9ktxkiN5g7MOpIp0jORTltDhTloyj7siSI6pUZpKu4MNRjzF03QHHFzj0Y3ge1UWrcao42CNI0iBMYIOxVrxm6O0SUivpKGinf84TdadpJJAKltGUmU4a8w44nq6idiKsC/Z7hdmvEezJE07ZGD+cZcR7QiHNHZsQ1WkDgQHDrVwsKruDiABeETOzHcUw2gG5NY3lPNPVHkfoCh3Q70zAPx2LiTwWsEkF2XIlMWx4Ls9gHifal1NHQJBnggrJUa1xvQcQI7NvJV2cFtPcMWtl4QmbPZpwgqUfbTeui5jkIM4ZziNibbay6u2nhiCQRlALcHTPrdxVMO4Ztz0bofslgDch3o4MIGSNDAM+Y9u5IcQDjjCZwI5BxWqHJju/2rjSrHHojiSiDbB1dplLYS4YnDZAUkET+10wP8Qj6ox7xCaNoo7Kb3/WOHjHcuXKMhYHhaMMKYaOrA8JgIyhUGzLwXLlJAFaKdMvvASdu4nrG1Our1Dv5Llyg4VSEmX49SNcxr8ZXLlxDAS9rXEbMsMZPVuTTrIwklrKjSfVvNB6yAYJ7Fy5dyEm1wdZtHsaS9renjDnEuI4XsuxPVLEx+EXXePX1rlynBDbe55Y6bmEhzsBux5bkY142BcuXEHj3/RXrqbKmzHcuXKThunZCHYGBtGzsG9ItOiKbjJkO9YEA9u/tXLlGEd1NMjzoEEyHs3XvM0y8A/SGHcmqWiXWeXNPnJzJAkDcA0AAcFy5R0pBuyUuWSNktZOAMccuxekAL1cuBPWkHADtTlKo5uA/T9Fy5SQf//Z" alt="Jeans" />
        </div>
        <div className="product-card">
          <img src="https://www.vans.com.au/media/catalog/product/cache/6abe8630b46db5a83670874e5572d16c/s/i/site_new_hoodie_images_3_.jpg" alt="Hoodie" />
        </div>
        <div className="product-card">
          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600" alt="Laptop" />
        </div>
        <div className="product-card">
          <img src="https://images.kabum.com.br/produtos/fotos/sync_mirakl/484198/xlarge/Mouse-Gamer-Exbom-Ms-g270-USB-3200-Dpi-RGB-7-Bot-es_1746723083.png" alt="Mouse" />
        </div>
        <div className="product-card">
          <img src="https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/k/6/k604-br3.jpg" alt="Teclado" />
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <a href="/" className="active">
          <FiHome size={20} />
          <span>Home</span>
        </a>
        <a href="/search">
          <FiSearch size={20} />
          <span>Search</span>
        </a>
        <a href="/favorites">
          <FiHeart size={20} />
          <span>Favorites</span>
        </a>
        <a href="/profile">
          <FiUser size={20} />
          <span>Profile</span>
        </a>
      </nav>
    </div>
  )
}

export default Home