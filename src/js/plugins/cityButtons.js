import $ from 'jquery'

import { onLoadHtmlSuccess } from '../core/includes'

const duration = 300 // animação para fadeIn/fadeOut

function filterByCity(city) {
    $('[wm-city]').each(function (i, e) {
        const isTarget = $(this).attr('wm-city') === city
            || city === null
        if (isTarget) {
            $(this).parent().removeClass('d-none')
            $(this).fadeIn(duration)
        } else {
            $(this).fadeOut(duration, () => {
                $(this).parent()
            })
        }
    })
}

$.fn.cityButtons = function () {

    const cities = new Set // cria-se um Set porque não quer que tenha repetição
    $('[wm-city]').each(function (i, e) {
        cities.add($(e).attr('wm-city')) // add no set o atributo wm-city
    })

    const btns = Array.from(cities).map(city => {
        const btn = $('<button>')
            .addClass(['btn', 'btn-info']).html(city)
        btn.click(e => filterByCity(city))
        return btn
    })

    const btnAll = $('<button>')
        .addClass(['btn', 'btn-info', 'active'])
        .html('Todas')
    btnAll.click(e => filterByCity(null))
    btns.push(btnAll)

    const btnGroup = $('<div>').addClass(['btn-group'])
    btnGroup.append(btns)

    $(this).html(btnGroup)
    return this
}
onLoadHtmlSuccess(function(){
    $('[wm-city-buttons]').cityButtons() // onde esta no html essa propriedade
    // apartir desse elemento, vai injetar os botões das cidades
})