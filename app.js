const cards = document.getElementById('cards')
const items = document.getElementById('items')
const pie = document.getElementById('pie')
const templateCard = document.getElementById('template-card').content
const templatePie = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()
let carrito = {} 

document.addEventListener('DOMContentLoaded', e => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
document.addEventListener('click', e => addCarrito(e))

items.addEventListener('click', e => btnAccion(e))


const fetchData = async () => {
    try {
        const respuesta = await fetch('api.json')
        const data = await respuesta.json()
        pintarCards( data )
    } catch (e){
        console.log(e)
    }
}

const pintarCards = data => {
    data.forEach( producto => {
        templateCard.querySelector( 'h5' ).textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.img);
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;
        const clone = templateCard.cloneNode( true )
        fragment.appendChild( clone )
    });
    cards.appendChild( fragment )
}

const addCarrito = e => {
    if ((e.target.classList.contains('btn-dark'))) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = '' 
    Object.values(carrito).forEach( producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio


        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarPie()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarPie = () => {
    pie.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        pie.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templatePie.querySelectorAll('td')[0].textContent = nCantidad
    templatePie.querySelector('span').textContent = nPrecio

    const clone = templatePie.cloneNode(true)
    fragment.appendChild(clone)
    pie.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito =  {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')){
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if (e.target.classList.contains('btn-danger')) {
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }    
        pintarCarrito()
    } 
    e.stopPropagation
}
