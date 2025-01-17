
const date = new Date()

function addZeroToLeft(num: number) {
    if (num < 10) {
        return `0${num}`
    } else {
        return num
    }


}

export function fullFormatedDate() {
    const date = new Date()
    const day = addZeroToLeft(date.getDate())
    const month = addZeroToLeft(date.getMonth()+1)
    const fulldate = `${day}${month}${date.getFullYear()}`

    return fulldate.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
} 

export function fullDate() {
    const date = new Date()
    const day = addZeroToLeft(date.getDate())
    const month = addZeroToLeft(date.getMonth()+1)
    const fulldate = `${day}${month}${date.getFullYear()}`

    return fulldate
} 

export function fullFormatedHour() {
    const date = new Date()
    const fullhour = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`

    return fullhour.replace(/(\d{2})(\d{2})/, '$1:$2')
} 

export function fullHour() {
    const date = new Date()
    const hour = addZeroToLeft(date.getHours())
    const minutes = addZeroToLeft(date.getMinutes())
    const second = addZeroToLeft(date.getSeconds())
    const fullhour = `${hour}${minutes}${second}`

    return fullhour
}   