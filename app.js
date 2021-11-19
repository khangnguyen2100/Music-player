const $ = document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)
const player = $('.app')
const cd = $('.playing-cd')
const heading = $('.playing-name')
const cdthumb = $('.cd')
const audio = $('.audio')
const audioLoad = $('.audio-load')
const author_cdthumb = $('.playing-artist')
const playlist = $('.playlist')
const playListHeading = $(".playlist-heading h2")
const songsEl = $('.songs')
const songEl = $$('.song')
const length_song = $('.length-song')
const current_time = $('.playing-time-current')
const duration_time = $('.playing-time-duration')
const repeatBtn = $('.btn-repeat')
const prevBtn = $('.btn-prev')
const playBtn = $('.btn-toggle')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random') 
const progress = $('.progress')
const playing = $('.playing')
const btnToggle = document.querySelector('.btn-toggle')
let currenIndex = 0
let current_play = false
let isRandom = false
let isRepeat = false
const API_URL = 'https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST?fbclid=IwAR0Q1wp5vjNfiuJrCYB8SGyXOLQM9Vmbasxhdn8fcb4e0f5HT0KWqQTJMAA'
const html = $('html')

getApi(API_URL)
function getApi(api) {
    fetch(api)
    .then(res => res.json())
    .then(data => {
        // Rap VN    data.songs.top100_VN[4].songs
        // hip hop   data.songs.top100_AM[2].songs
        var songs = data.songs.top100_AM[0].songs
        var name = data.songs.top100_AM[0].name
        start(songs,name)
    });
}
function start(songs,name) {
        // start
        {
            reder(songs,name)
            removeActive()
            loadCurrenSong(songs)
            handleEvent(songs)
            clicksong(songs)
            ended(songs)
        }
    // render playlist
    function reder(songs,name) {
        const  htmls = songs.map(function(song,index)  {
            return `
            <div class="song ${index === currenIndex  ? 'active' : '' }" data-index="${index}">
                <div class="song-count">${index + 1}</div>
                <div class="song-info">
                    <div class="song-avatar">
                        <i class="fas fa-play"></i>
                        <img src="${song.bgImage == "" ? song.avatar : song.bgImage}" alt="" class="song-avatar-img">
                    </div>
                    <p class="song-name">${song.title}</p>
                </div>
                <p class="song-artist">${song.creator}</p>
                <div class="song-option">
                    <i class="fas fa-ellipsis-v"></i>
                    <div class="dropdown">
                        <li class="dropdown-item"><a href="#" class="dropdown-link">
                            Add to playlist
                            <i class="far fa-music"></i>
                        </a></li>
                        <li class="dropdown-item"><a href="#" class="dropdown-link">
                            play next
                            <i class="far fa-chevron-double-right"></i>
                        </a></li>
                        <li class="dropdown-item"><a href="#" class="dropdown-link">
                            love
                            <i class="far fa-heart"></i>
                        </a></li>
                        <li class="dropdown-item"><a href="#" class="dropdown-link">
                            share
                            <i class="far fa-share"></i>
                        </a></li>
                    </div>
                </div>
            </div>
            `
        })
        songsEl.innerHTML = htmls.join('')
        playListHeading.innerText = `Top ${songs.length} ${name == undefined ? '' : name}`
        length_song.innerText = `${songs.length} songs`
    }
    // remove active 
    function removeActive() {
        document.querySelector('.song.active').classList.remove('active')
    }
    // loading song
    function loadCurrenSong(songs) {
        heading.textContent = songs[currenIndex].title
        author_cdthumb.textContent = songs[currenIndex].creator
        cdthumb.src = songs[currenIndex].bgImage == "" ? songs[currenIndex].avatar :songs[currenIndex].bgImage
        audio.src = songs[currenIndex].music
    }
    function handleEvent(songs) {
        // play and pause
        playBtn.onclick = function() {
                if(current_play) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
            audio.onplay = function() {
                current_play = true
                player.classList.add('current-play')
                btnToggle.classList.add('active')
            }
            audio.onpause = function() {
                current_play = false
                btnToggle.classList.remove('active')
                player.classList.remove('current-play')
            }
        // rotate
        // const cdthumbAnimate =  
        //     cdthumb.animate([
        //         { transform: 'rotate(360deg)'}
        //     ],{
        //         duration : 10000,
        //         iterations : Infinity
        //         }
        //     )
        //     cdthumbAnimate.pause()
        // seek progress
        
        {
            audio.ontimeupdate = function() {
                const progressPre = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPre || 0  
                let minute = Math.floor(audio.currentTime / 60)
                let second = Math.floor(audio.currentTime)
                second %= 60
                if (second <= 9) {
                    second = '0'+(second+'')
                }
                if (audio.currentTime !== 0) {
                    current_time.innerText = `${minute}:${second}` 
                } 
                if (isNaN(audio.duration) === false) {
                    duration_time.innerText = `${Math.floor(audio.duration/60)}:${Math.floor(audio.duration%60) < 9 ? `0${Math.floor(audio.duration%60)}`:Math.floor(audio.duration%60)}`                     
                }
            }
            progress.oninput = function(e) {
                const seektime = Math.floor(audio.duration / 100 * e.target.value)
                audio.currentTime = seektime
            }
        }
        // random on/off
        randomBtn.onclick = function() {
            if(isRandom) {
                randomBtn.classList.remove('active')
                isRandom = false
            } else {
                randomBtn.classList.add('active')
                isRandom = true
            }
        }
        // next song
        nextBtn.onclick = function() {
            if(isRandom) {
                playRandom(songs)
            } else {
                currenIndex++
                if(currenIndex >= songs.length) {
                    currenIndex = 0
                }
                loadCurrenSong(songs)
                }
            audio.play()
            reder(songs)
            scrollintoview()
        }
        // prev song 
        prevBtn.onclick = function() {
            if(isRandom) {
                playRandom(songs)
            } else {
                currenIndex--
                if(currenIndex < 0) {  
                    currenIndex = songs.length -1
                }
                loadCurrenSong(songs)
            }
            audio.play()
            reder(songs)
            scrollintoview()
        }
        // repeat 
        repeatBtn.onclick = function() {
            if(isRepeat) {
                repeatBtn.classList.remove('active')
                isRepeat = false
            } else {
                isRepeat = true
                repeatBtn.classList.add('active')
                audio.onended = function() {
                    if(isRepeat) {
                        loadCurrenSong(songs)
                        audio.play()
                    } else {
                        nextBtn.click()
                    }
                }        
            }
        }
    }
    // handle random
    function playRandom(songs) {
        let newIndex 
            do {
                newIndex = Math.floor(Math.random() * songs.length)
            } while (newIndex === currenIndex)
                currenIndex = newIndex
                loadCurrenSong(songs)
    }
    // nextended
    function ended(songs) {
        audio.onended = function () {
            if (isRepeat) {
                audio.play()
            } else {
                nextBtn.click();
            }
        }
    }
    // scroll center view
    function scrollintoview() {
        setTimeout(() => {
            $('.song.active').scrollIntoView( {
                block: 'center',
                behavior :'smooth'
            })
        },300)
    }
    // click song
    function clicksong(songs) {
        songsEl.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.song-option')
            if(!songOption) {
                playing.classList.add('see');
            }
            if (songNode && !songOption) {
                currenIndex = Number(songNode.dataset.index)
                reder(songs)
                loadCurrenSong(songs)
                audio.play()
            }
        }
    }
}
window.addEventListener('keydown', (e) => {
    if (e.code == "Space") {
        e.preventDefault()
        if (current_play == true) {
            audio.pause()
            current_play = false
        }
        else {
            audio.play()
            current_play = true
        }
    }
})