function load() {
    if (localStorage.getItem("email") > "") {
        db.collection("usuarios").doc(localStorage.getItem("email")).get().then((doc) => {
            if (doc.exists) {
                localStorage.setItem("data", doc.data().data)
                localStorage.setItem("nome", doc.data().nome)
                localStorage.setItem("saldo", doc.data().saldo)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    if (localStorage.getItem("logado") == "sim") {
        document.getElementById("btnl").style.display = "None"
        document.getElementById("deslogar").style.display = "block"

    } else {
        document.getElementById("btnl").style.display = "block"
        document.getElementById("deslogar").style.display = "none"
        document.getElementById("saldo").style.display = "none"
    }
    //SALDO
    document.getElementById("saldo").innerHTML = 'Saldo: R$' + localStorage.getItem("saldo")

    document.getElementById("txtsaldomodal").innerHTML = 'Saldo: R$' + localStorage.getItem("saldo")
        //EXIBIR CURSOS
    db.collection("cursos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {




            const card = document.createElement("li");
            const img = document.createElement("img")
            const p = document.createElement("p")
            const categoria = document.createElement("div")
            const span = document.createElement("span")
            const h2 = document.createElement("h2")
            const btn = document.createElement("button")
            btn.innerHTML = "Adquirir"
            btn.className = 'mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
            h2.innerHTML = doc.data().titulo
            p.innerHTML = doc.data().descricao
            card.className = 'card ln'
            img.src = doc.data().capa
            img.className = 'cardimg'
            btn.onclick = function comprar() {
                if (localStorage.getItem("email") == null) {
                    Swal.fire(
                        'Você Precisa Está Logado',
                        '',
                        'error'
                    )
                } else {


                    Swal.fire({
                        title: 'Realmente Deseja Comprar?',
                        text: "Reebolso No Máximo Em 3 Dias Após A Compra",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#2563eb',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sim, Quero!',
                        cancelButtonText: 'Desistir'
                    }).then((result) => {
                        if (result.isConfirmed) {


                            db.collection("cursos" + localStorage.getItem("email")).doc(doc.id).get().then((doc) => {
                                if (doc.exists) {
                                    Swal.fire(
                                        'Você Já Tem Esse Curso',
                                        '!',
                                        'error'
                                    )
                                } else {




                                    if (localStorage.getItem("saldo") < 5) {
                                        Swal.fire(
                                            'Saldo Insuficiente',
                                            'A Taxa De Desenvolvimento é R$5, <BR> Recarregue Sua Conta',
                                            'error'

                                        )

                                    } else {


                                        db.collection("usuarios").doc(localStorage.getItem("email")).update({
                                                saldo: parseInt(localStorage.getItem("saldo")) - parseInt(5)
                                            })
                                            .then(() => {
                                                Swal.fire(
                                                        'Curso Adquirido!',
                                                        ' <a href="./pages/compras.html" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Clique Aqui</a> Para Fazer Download Do Curso',
                                                        'success'
                                                    )
                                                    //ADD CURSO ACCOUNT
                                                var data = new Date().toLocaleDateString();
                                                var time = new Date().toLocaleTimeString()
                                                db.collection("cursos" + localStorage.getItem("email")).doc(doc.id).set({
                                                        data: data,
                                                        hora: time,
                                                    })
                                                    .then(() => {
                                                        console.log("Curso Adicionado");
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error writing document: ", error);
                                                    });

                                            })
                                            .catch((error) => {
                                                Swal.fire(
                                                    'ERRO AO ADQUIRIR O CURSO',
                                                    ' <a href="./pages/compras.html" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Clique Aqui</a> Para Entrar Em Contato',
                                                    'error'
                                                )
                                            });

                                    }
                                }
                            })
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });

                }



            }
            categoria.className = 'categoria'
            span.innerHTML = doc.data().categoria

            img.onclick = function() {
                Swal.fire({
                    title: doc.data().titulo,


                    html: '<p>' + doc.data().descricao + '</p> ',

                    showConfirmButton: false,
                    imageUrl: doc.data().capa,
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: doc.data().titulo,
                })
            }

            card.appendChild(img)

            card.appendChild(h2)
            card.appendChild(p)
            categoria.appendChild(span)
            card.appendChild(categoria)

            card.appendChild(btn)
            document.getElementById("cursos").appendChild(card);



        });
    });


}



function conta() {
    document.getElementById("email").innerHTML = localStorage.getItem("email")
    document.getElementById("nome").innerHTML = localStorage.getItem("nome")
    document.getElementById("data").innerHTML = localStorage.getItem("data")
}


function cadastro() {
    var data = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString()
    db.collection("usuarios").doc(document.getElementById("emailc").value).set({
            nome: document.getElementById("nomec").value,
            email: document.getElementById("emailc").value,
            data: data,
            senha: document.getElementById("passwordc").value,
            saldo: 0

        })
        .then(() => {

            localStorage.setItem("cadastrado", "sim")
            console.log("Cadastrado");
            location.reload()
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function login() {
    var data = new Date().toLocaleDateString();
    db.collection("usuarios").doc(document.getElementById("email").value).get().then((doc) => {
        if (doc.exists) {

            if (document.getElementById("password").value == doc.data().senha) {
                document.getElementById("alert").style.color = "green"
                document.getElementById("alert").style.display = 'block'
                document.getElementById("alert").innerText = "Logado Com Sucesso!"
                localStorage.setItem("email", document.getElementById("email").value)
                localStorage.setItem("logado", "sim")

                location.reload()



            } else {
                document.getElementById("alert").style.display = 'block'
            }
        } else {

        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function enviar() {
    var data = new Date().toLocaleDateString();
    db.collection("cursos").add({
            titulo: document.getElementById("titulo").value,
            categoria: document.getElementById("categoria").value,
            capa: document.getElementById("capa").value,
            tamanho: document.getElementById("tamanho").value,
            descricao: document.getElementById("descricao").value,
            autor: document.getElementById("autor").value,
            torrent: document.getElementById("torrent").value,
            data: data,

        })
        .then(() => {
            alert("Postado")
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function deslogar() {
    localStorage.clear()
    location.reload()
}


function compras() {
    db.collection("cursos" + localStorage.getItem("email")).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            db.collection("cursos").doc(doc.id).get().then((doc) => {



                const card = document.createElement("li");
                const img = document.createElement("img")
                const p = document.createElement("p")
                const categoria = document.createElement("div")
                const span = document.createElement("span")
                const h2 = document.createElement("h2")
                const btn = document.createElement("button")
                btn.innerHTML = "Baixar(Torrent)"
                btn.className = 'mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                h2.innerHTML = doc.data().titulo
                p.innerHTML = doc.data().descricao
                card.className = 'card ln'
                img.src = doc.data().capa
                img.className = 'cardimg'
                btn.onclick = function comprar() {

                    navigator.clipboard.writeText(doc.data().torrent);
                    Swal.fire(
                        'Link Magnetico Copiado!',
                        'Basta Colar Em Algum Software Torrent e Ser Feliz',
                        'success'
                    )
                }
                categoria.className = 'categoria'
                span.innerHTML = doc.data().categoria

                img.onclick = function() {
                    Swal.fire({
                        title: doc.data().titulo,


                        html: '<p>' + doc.data().descricao + '</p> ',

                        showConfirmButton: false,
                        imageUrl: doc.data().capa,
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: doc.data().titulo,
                    })
                }

                card.appendChild(img)

                card.appendChild(h2)
                card.appendChild(p)
                categoria.appendChild(span)
                card.appendChild(categoria)

                card.appendChild(btn)
                document.getElementById("compras").appendChild(card);




            });
        });





    });


}