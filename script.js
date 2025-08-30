async function getData() {
    const response = await fetch('https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json');
    const data = await response.json();
    console.log(data);  
    return data;
}

getData()