function sended() {
    console.log('Help');
    let getName = document.querySelector('#boxName').value
    let getEmail = document.querySelector('#boxEmail').value
    let getPassword = document.querySelector('#boxPassword').value
    let getConfirmPassword = document.querySelector('#boxConfirmPassword').value
    console.log(get);
    let regexnome = /\d+/
    let regexsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if(regexnome.test(getName) == true || getName === ""){
        alert('Nome não pode conter letras e o campo não pode ser vazio, tente novamente');
    }

    if (regexsenha.test(getPassword) == true){
        alert('A senha deve possuir letras e numeros, a senha não pode ser vazia e não pode ter menos que 8 caracteres');
    }

    if (getPassword != getConfirmPassword){
        alert('As senhas devem ser iguais');
    }

}
