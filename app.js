
// modulos
const express = require('express')
const { engine } =  require('express-handlebars');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash');
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require('./models/Categoria')
const Categoria = mongoose.model("categorias")
const passport = require("passport")
require("./config/auth")(passport)
const db = require("./config/db")


//configurações
    //session 
    app.use(session({
        secret:'cursodenode',
        resave:true,
        saveUninitialized:true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    
    //flash 
    app.use(flash())
    //middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error =req.flash("error")
        res.locals.user = req.user || null;
        next()
    })

    //body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

    //handlebars
 //Template Engine
 app.engine('handlebars', engine({defautLayout: 'main',
 runtimeOptions: {
           allowProtoPropertiesByDefault: true,
     
           allowProtoMethodsByDefault: true,
         }}))
 app.set('view engine', 'handlebars')

 //mongoose
 mongoose.connect(db.mongoURI, {
   
})
    .then(()=>{
        console.log('Conectado com sucesso')
    })
    .catch((error)=>{
        console.log('Houve um erro ao se conectar '+ error)
    })
 //public
         app.use(express.static(path.join(__dirname,"public")))
//Rotas
        app.get("/", (req,res)=>{
            Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens )=>{
                res.render('index', {postagens:postagens})
            }).catch((error)=>{
                req.flash("error_msg", "Houve um erro ao carregar as postagens. ")
                res.redirect("/404")
            })
            
        })
        app.get("/postagem/:slug", (req,res)=>{
            Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
                if(postagem){
                    res.render("postagem/index", {postagem: postagem})
                }else{
                    req.flash("error_msg", "esta postagem não existe.")
                    res.redirect("/")

                }
            }).catch((error)=>{
                req.flash("error_msg", "Houve um erro interno")
                res.redirect("/")
            })
        })
        app.get("/categorias",(req,res)=>{
            Categoria.find().then((categorias)=>{
                res.render("categorias/index",{categorias:categorias})

            }).catch((error)=>{
                req.flash("error_msg", "Houve um erro interno ao listar categorias.")
                res.redirect("/")
            })
        app.get("/categorias/:slug",(req,res)=>{
            Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
                if(categoria){
                    Postagem.find({categoria:categoria._id}).then((postagens)=>{
                        res.render("categorias/postagens", {postagens:postagens, categoria:categoria })

                    }).catch((error)=>{
                        req.flash("error_msg","Houve um erro ao listar os posts.")
                        res.redirect("/")
                    })
                }else{
                    req.flash("error_msg", "Esta categoria não existe.")
                    res.redirect("/")
                }

            }).catch((error)=>{
                req.flash("error_msg","houve um erro interno ao carregar a pagina desta categoria.")
                res.redirect("/")
            })
        })
       
        })
        app.get("/404", (req,res)=>{
            res.send("Erro 404")
        })
         app.use('/admin',admin)
         app.use('/usuarios',usuarios)
        

//outros
const PORT =process.env.PORT ||  8081;
app.listen(PORT, ()=>{
    console.log('Servidor rodando!')
})