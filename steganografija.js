//ucitavanje slike na canvas
var imageLoader = document.getElementById('inputImg');
    imageLoader.addEventListener('change', ucitajImg);

function ucitajImg(e) {
    var reader = new FileReader();
    reader.onload = function(event) {

        var img = new Image();
        img.onload = function() {
            var canvas = document.getElementById('imgCanvas');
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);   
};

//smještanje poruke u sliku
var messageLoader = document.getElementById('submitMsg');
messageLoader.addEventListener('click', ucitajMsg);  

function ucitajMsg(e)
{
    //dohvacanje slike
    var canvas = document.getElementById('imgCanvas');
    var ctx = canvas.getContext('2d');
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var colors = imgData.data;

    //manipulacija poruke - pretvaranje u bitove
    var message=document.getElementById("inputMsg").value;
    if (message.length>255*3)
    {
        window.alert("Poruka je predugačka!");
        return;
    }
    if (message.length<1)
    {
        window.alert("Unesite nekakvu poruku!");
        return;
    }
    var messageBits=[]; 
    for (var i=0; i< message.length; i++)
    {        
        messageBits.push(("00000000"+(message.charCodeAt(i)).toString(2)).substr(-8));
    }
  

    var poruka=messageBits.join("").split(""); //samo niz 0 i 1 koje predstavljaju poruku
    var p=[...poruka];
    document.getElementById("ispis").innerHTML="Message length: "+poruka.length/8+" characters";
    

    //jednostavan postupak smještanja poruke u sliku - smjestiti po jedan bit u svaku od RGB komponenti piksela
    for (var i=0; i<colors.length; i++)
    {

        if (i%4!=3) //izbjegavamo alpha komponentu piksela
        {
            if  (colors[i]%2==0 && poruka[0]==="1") { colors[i]+=1; }
            else if (colors[i]%2!=0 && poruka[0]==="0") { colors[i]-=1; }
            poruka.shift();
        }

        if(poruka.length<1)  { break } //prekidamo kad smo unijeli cijelu poruku
    }

    //spremamo duljinu poruke u zadnji piksel
    var t1, t2, t3;

    if (message.length>255*2) { t1=255; t2=255; t3=message.length-255*2; }
    else if (message.length>255) { t1=255; t2=message.length-255; t3=0; }
    else { t1=message.length; t2=0; t3=0; }
        
    colors[colors.length-4]=t1;
    colors[colors.length-3]=t2;
    colors[colors.length-2]=t3;    

    //prikazujemo promijenjenu sliku     
    var outputCanvas= document.getElementById("outputCanvas");
    var outputCtx=outputCanvas.getContext('2d');
    outputCanvas.width=ctx.canvas.width;
    outputCanvas.height=ctx.canvas.height;
    outputCtx.putImageData(imgData, 0, 0);
}

//dobivanje poruke iz slike
var outputMsg = document.getElementById('decryptImg');
outputMsg.addEventListener('click', decodeMsg);
function decodeMsg()
{
    //ucitavanje slike
    var canvas = document.getElementById('outputCanvas');
    var ctx = canvas.getContext('2d');
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var colors = imgData.data;
    var messageBits=[];
    var msgLength=(colors[colors.length-4]+colors[colors.length-3]+colors[colors.length-2])*8;

    //citamo poruku iz slike
    for (var i=0; i<colors.length;i++)
    {
        if (i%4!=3)
        {
            if (colors[i]%2===0) { messageBits.push(0); }
            else { messageBits.push(1); }
        }
        if (messageBits.length===msgLength) { break } //ako smo dostigli duljinu poruke, prekidamo
    }

    var poruka=[];

    //uzimamo po 8 bitova poruke i pretvaramo ih u znak
    for (var i=0; i<messageBits.length; i=i+8)
    {
        var slovo=messageBits.slice(i, i+8).join("");
        var slovoBroj=0;
        //pretvorba iz binarnog u dekadski
        for(var j=0; j<8;j++)
            {
                if (slovo[j]=="1") { slovoBroj+=Math.pow(2, 7-j); }
            }

        for(var j=0; j<255; j++)
        {
            var znak = String.fromCharCode(j);
            if (znak.charCodeAt(0)===slovoBroj)
            {
                poruka.push(znak); 
                break           
            }
        } 
    }
    
    document.getElementById("outputMsg").innerHTML=poruka.join(""); //ispisujemo poruku

}



//ucitavanje slike koja vec ima poruku u sebi
var imageLoader2 = document.getElementById('inputImg2');
    imageLoader2.addEventListener('change', ucitajImg2);
function ucitajImg2(e) {
    
    var reader = new FileReader();
    reader.onload = function(event) {

        var img = new Image();
        img.onload = function() {
            var canvas = document.getElementById('outputCanvas');
            var ctx = canvas.getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);   
    
};



