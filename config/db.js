if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://thalio:160797ta@blogapp-prod.5view.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports ={mongoURI:"mongodb://localhost/blogapp"}
}