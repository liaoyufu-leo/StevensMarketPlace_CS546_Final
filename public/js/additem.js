//This for displaying picture (before you post your listing)

const imageFile = document.getElementById("picture");
let imageValue = imageFile.value

const openFile = function(file){
    const input = file.target;

const reader = new FileReader();
reader.onload = function(){
    const dataURL = reader.result;
    const output = document.getElementById('output');
    output.src=dataURL 
}
reader.readAsDataURL(input.files[0]);
document.querySelector('#picture').addEventListener('change', event =>{
    handleImageUpload(event)
})
}

//Form validation
const staticForm = document.getElementById("static-form");


if(staticForm){

    staticForm.addEventListener("submit", event => {
        const name = document.getElementById("name")
        const nameValue = name.value

        const description = document.getElementById("description")
        const descriptionValue = description.value

        const price = document.getElementById("price")
        const priceValue = price.valueAsNumber

        const picture = document.getElementById("picture")
        const pictureValue = picture.value
        if(!nameValue){
            alert("Product Name is blank or not the correct format! Please try again.")
        }
        else if(!categoryValue || typeof(categoryValue) !== "string"){
            alert("Category is blank or not the correct format! Please try again.")
        }
        else if(!descriptionValue || typeof(descriptionValue) !== "string"){
            alert("Description is blank or not the correct format! Please try again.")
        }
        
        else if(!priceValue || typeof(priceValue) !== "number"){
            alert("Price is blank or not entered as a number! Please try again")
        }
        else if(priceValue <= 0){
            alert("Price cannot be 0 or a negative number! Please try again.")
        }
        else if(!pictureValue || typeof(pictureValue)!=="string"){
            alert("Picture is blank or not the correct format! Please try again")
        }
    })
   
}