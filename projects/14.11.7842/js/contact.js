function ckForm(){
	var str, error;
	str = "";
	error = 0;
	if(document.getElementById("nama").value.length<= 0){
		str += "- Nama tidak boleh kosong.\n";
		error++;
	}
	if(document.getElementById("email").value.length<= 0){
		str += "- E-mail tidak boleh kosong.\n";
		error++;
	}
	if(document.getElementById("negara").value.length<= 0){
		str += "- Negara belum ditentukan.\n";
		error++;
	}
	if(error > 0){
		alert("Terdapat kesalahan : \n"+ str);
		return false;
	} else{
		alert("Terima Kasih");
		return true;
	}
}