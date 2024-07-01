let names = ['Alex', 'Berta', 'Christian'];

function showNames() {
    let list = document.getElementById("list");
    list.innerHTML = '';
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        list.innerHTML +=/*html*/`
        <li>${name}</li>
    `
    }
}

function filterNames() {
    let search = document.getElementById('search').value;
    search = search.toLowerCase();
    console.log(search);
    let list = document.getElementById("list");
    list.innerHTML = '';
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.toLowerCase().includes(search)) {
        list.innerHTML +=/*html*/`
        <li>${name}</li>
    ` }

        }

}