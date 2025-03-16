export default function stractTaskList(list:any) {
    return list.map((arr:any) => {
        const keys = Object.values(arr)
        return keys.map(({order}:any) => order)
    })  
    
}