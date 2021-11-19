document.querySelector(".playlist").addEventListener('click' ,() => {
    const dropDowns = document.querySelectorAll(".dropdown")
    const options = document.querySelectorAll('.song-option')
    options.forEach((option,i) => {
        option.onclick = () => {
            dropDowns[i].classList.toggle('active')
        }
    })
})
// nav reponsitive
const sideBar = document.querySelector('.sidebar')
const btnMobile = document.querySelector('.btn-mobile')
btnMobile.addEventListener('click' ,() => {
    btnMobile.classList.toggle('active')
    sideBar.classList.toggle('active')
})
// change theme
const theme = document.querySelector('.theme')
const body = document.querySelector('body')
theme.addEventListener('click' ,() => {
    body.classList.toggle('light-mode')
})
// btn toggle
// const btnToggle = document.querySelector('.btn-toggle')
// btnToggle.addEventListener('click' ,() => {
//     btnToggle.classList.toggle('active')
// })
// onloand remove song active