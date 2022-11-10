const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')

const contadorCarrito = document.getElementById('contadorCarrito')
const precioTotal = document.getElementById('precioTotal')

const botonVaciar = document.getElementById('vaciar-carrito')

let carrito = []

fetch('../data.json')
.then((response) => response.json())
.then((info) => mostrarProductos(info))
.catch((error) => {
    console.log(error)
})

botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
})


// === PRODUCTOS ===
let nuevoArray = []
    const mostrarProductos = (array) => {
        nuevoArray = array

        contenedorProductos.innerHTML = ""
    
        nuevoArray.forEach( (producto) => {
            const div = document.createElement('div')
            div.classList.add('box-container')
            div.innerHTML = `
            <div class="products">
                <div class="box-container">
                    <div class="box">
                        <span class="discount">${producto.descuento1}</span>
    
                        <div class="image">
                            <img src="${producto.img}" alt="">
                        </div>
    
                        <div class="content">
                            <h3>${producto.nombre}</h3>
                            <h4>${producto.tipo}</h4>
                            <div class="price">$${producto.descuento2}
                                <span>$${producto.precio}</span>
                            </div>
                        </div>
                    
                        <button onclick="agregarAlCarrito(${producto.id})" class="btn">Agregar <i class="fas fa-shopping-cart"></i></button>
    
                    </div>
                </div>
            </div>
            `
            contenedorProductos.appendChild(div)
        } )
    }


// === CARRITO ===
const agregarAlCarrito = (prodId) => {
    const item = nuevoArray.find( (prod) => prod.id === prodId)
    carrito.push(item)
    
    saveCartToStorage()

    actualizarCarrito()

    Toastify({
        text: "Agregaste correctamente el producto al carrito",
        className:  "info",
        style: {
            margin: "8rem",
            background: "#333 ",
        }
    }).showToast();
}

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find( (prod) => prod.id === prodId )
    const indice = carrito.indexOf(item)

    carrito.splice(indice, 1)

    actualizarCarrito()
    
    localStorage.setItem('carrito', JSON.stringify(carrito))

    Swal.fire({
        title:"Eliminaste correctamente el producto!",
        icon: "success"
    })
}

const actualizarCarrito = () => {

    contenedorCarrito.innerHTML = ""

    carrito.forEach( (prod) => {
        const div = document.createElement('div')
        div.className = "productoEnCarrito"
        div.innerHTML = 
        `
        <div class="cart">
            <div class="box-container">
                <div>
        
                    <div class="content">
                        <h3>${prod.nombre}</h3>
                        <h4>${prod.tipo}</h4>
                        <div class="price">$${prod.descuento2}</div>
                    </div>
                
                    <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar btn"><i class="fas fa-trash-alt"></i></button>

                </div>
            </div>
        </div>
                
        `

        contenedorCarrito.appendChild(div)
    })

    contadorCarrito.innerText = carrito.length
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio, 0)
}

let botonCompra = document.getElementById("comprar")
botonCompra.addEventListener("click", compra)
function compra(){
    if (carrito == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor agregue un producto al carrito',
        })
    } else {
        Swal.fire({
            title: 'Esta seguro que desea realizar la compra?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, comprar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Compra realizada con éxito !',
                'Muchas gracias !',
                'success'
            )
            }
        })
    }
}


// === FILTROS ===
const filtroTipo = document.getElementById('filtroTipo')

const filtrarProductos = () => {
	const value = filtroTipo.value;
	fetch("../data.json")
		.then((response) => response.json())
		.then((info) => {
			if (value === "all") {
				mostrarProductos(info);
			} else {
				const filtrado = info.filter((prod) => prod.tipo === value);
				mostrarProductos(filtrado);
			}
		});
};

filtroTipo.addEventListener('change', () => {
    filtrarProductos()
})


// === MODAL ===
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const botonAbrir = document.getElementById('boton-carrito')
const botonCerrar = document.getElementById('carritoCerrar')
const modalCarrito = document.getElementsByClassName('modal-carrito')[0]


botonAbrir.addEventListener('click', ()=>{
    contenedorModal.classList.toggle('modal-active')
})

if(botonCerrar != null){
    botonCerrar.addEventListener('click', ()=> {
        contenedorModal.classList.toggle('modal-active')
    })
}

contenedorModal.addEventListener('click', () => {
    botonCerrar.click()
})
modalCarrito.addEventListener('click', (event) => {
    event.stopPropagation()
})


// === STORAGE & JSON ===
function saveCartToStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

function loadCartFromStorage(){
    if(localStorage.getItem('carrito') != null){
        carrito = JSON.parse(localStorage.getItem('carrito'))
    }
}

loadCartFromStorage()
actualizarCarrito()