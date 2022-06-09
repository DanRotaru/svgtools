$(".git").click(function(){
    window.open("https://github.com/DanRotaru/icons", "_blank");
});

// $(document).ready(function () {
//     $("#svg").val(`
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path d="M5.13,10.71H8.87L6.22,8.06A1.84,1.84,0,1,1,8.06,6.22l2.65,2.65V5.13a1.84,1.84,0,0,1,0-2.59,1.81,1.81,0,0,1,2.58,0,1.84,1.84,0,0,1,0,2.59V8.87L16,6.22a1.83,1.83,0,1,1,1.83,1.84l-2.65,2.65h3.74a1.84,1.84,0,0,1,2.59,0,1.81,1.81,0,0,1,0,2.58,1.84,1.84,0,0,1-2.59,0H15.13L17.78,16A1.83,1.83,0,1,1,16,17.78l-2.66-2.65v3.74a1.84,1.84,0,0,1,0,2.59,1.81,1.81,0,0,1-2.58,0,1.84,1.84,0,0,1,0-2.59V15.13L8.06,17.78A1.84,1.84,0,1,1,6.22,16l2.65-2.66H5.13a1.84,1.84,0,0,1-2.59,0,1.81,1.81,0,0,1,0-2.58A1.84,1.84,0,0,1,5.13,10.71Z" transform="translate(-1.5 -1.5)" style="fill:#d2ebf6;stroke:#009640;stroke-miterlimit:10"/></svg>
//     `);
// });

function clear(text, type){
    text = text.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>/gmi, '');
    text = text.replace(/ data-name=("|')(.*?)("|')/g, '');
    text = text.replace(/<\?xml version="(.*?)" \?>/gmi, '');

    //remove comments
    text = text.replace(/<!-- (.*?) -->/gmi, '');

    text = text.replace(/id="(.*?)"/gmi, "");
    let textOr = text;

    text = text.replace(/<svg><path fill=("|')(.*?)("|') d=("|')(.*?)("|')><\/path><\/svg>/g,`&lt;svg viewBox="0 0 24 24"&gt;\n    &lt;path fill="$1" d="$2"&gt;\n    &lt;/path&gt;\n&lt;/svg&gt;`);

    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');

    if(type == "cssbg"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = 'background-image: url("data:image/svg+xml,'+text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent )+'");';;
        data = data.replace(/background-image/g,'<qteg>background-image</qteg>');
        data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = data;
    }
    else if(type == "cssurl"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = 'url("data:image/svg+xml,'+text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent )+'");';
        data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = data;
    }else if(type == "dataimg"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = 'data:image/svg+xml,'+text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent );
        // data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = `<qstr>${data}</qstr>`;
    }else if(type == "dataimgClear"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = 'data:image/svg+xml,'+text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent );
        // data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = data;
    }else if(type == "svgimg"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = '<img src="data:image/svg+xml,'+text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent )+'"/>';
        data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = data;
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
        text = text.replace(/img/g,'<qteg>img</qteg>');
        text = text.replace(/src="(.*?)"/g,'<qattr>src</qattr>=<qstr>"$1"</qstr>');
    }else if(type == "encoded"){
        let text1 = textOr;
        text1 = text1.replace(/xmlns=("|')http:\/\/www\.w3\.org\/2000\/svg("|')/gmi, '');
        text1 = text1.replace(/<svg/, "<svg xmlns='http://www.w3.org/2000/svg'");
        text1 = text1.replace(/"/g, "'");
        let data = text1.replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent );
        // data = data.replace(/url\("(.*?)"\)/g,'<qteg>url(</qteg><qstr>"$1"</qstr><qteg>)</qteg>');
        text = `<qstr>${data}</qstr>`;
    }else{
        text = text.replace(/(.*?!<)=(?:'|")(.*?)(?:'|")/gi,'<qattr>$1</qattr>=<qstr>"$2"</qstr>');
        text = text.replace(/(.*?)=(?:'|")(.*?)(?:'|")/gi,'<qattr>$1</qattr>=<qstr>"$2"</qstr>');
        text = text.replace(/svg/gi,'<qteg>svg</qteg>');
        text = text.replace(/path/gi,'<qteg>path</qteg>');
        text = text.replace(/\<g/gi,'<qteg><g</qteg>');
        text = text.replace(/\<\/g>/gi,'<qteg></g></qteg>');
        // text = text.replace(/viewBox=(?:'|")(.*?)(?:'|")/gi,'<qattr>viewBox</qattr>=<qstr>"$1"</qstr>');
        // text = text.replace(/fill=(?:'|")(.*?)(?:'|")/gi,'<qattr>fill</qattr>=<qclr>"$1"</qclr>');
        // text = text.replace(/width=(?:'|")(.*?)(?:'|")/gi,'<qattr>width</qattr>=<qclr>"$1"</qclr>');
        // text = text.replace(/height=(?:'|")(.*?)(?:'|")/gi,'<qattr>height</qattr>=<qclr>"$1"</qclr>');
        // text = text.replace(/d=(?:'|")(.*?)(?:'|")/gi,'<qattr>d</qattr>=<qstr>"$1"</qstr>');
        // text = text.replace(/style=(?:'|")(.*?)(?:'|")/gi,'<qattr>style</qattr>=<qstr>"$1"</qstr>');
        // text = text.replace(/transform=(?:'|")(.*?)(?:'|")/gi,'<qattr>transform</qattr>=<qstr>"$1"</qstr>');
        
    }
    
    // text = text.replace(/                /g, '');
    return text;
    
}

function clearTags(svg){
    return svg.replace(/<qteg>(.*?)<\/qteg>/g, '$1')
    .replace(/<qattr>(.*?)<\/qattr>/g, '$1')
    .replace(/<qattr>(.*?)<\/qattr>/g, '$1');
}

const getPath = svg => svg.match(/<path\b([\s\S]*?)>/gmi);

function HexTo6(hexcolor){
    if(hexcolor[0] == "#"){
        hexcolor = hexcolor.replace(/\#/g, '');

        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
            return "#" + hexcolor;
        }
        else return "#" + hexcolor;
    }
    else return hexcolor;
}
function createColor(name){
    d = document.createElement("div");
    document.body.appendChild(d);
    d.style.color = name;
    let color = window.getComputedStyle(d).color;
    document.body.removeChild(d);
    return color.replace(/(rgb\(|\)| )/g, '');
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function getFill(svg){
    let rColor;
    let r = svg.match(/fill=(?:'|")(.*?)(?:'|")/gmi);
    // console.log(r[0]);
    if(r !== null) {
        r = r[0].replace(/fill=(?:'|")(.*?)(?:'|")/gmi, '$1');
        if(r.search("rgb") > -1){
            let c = r.replace(/(rgb\(|\)| )/g, '').split(",");
            r = rgbToHex(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]));
            rColor = r;
        }
        else if(r.search("#") > -1){
            r = HexTo6(r);
            rColor = r;
        }
        else if(r.search("CURRENTCOLOR") > -1 || r.search("currentColor") > -1){
            r = "currentColor";
            rColor = "#FFFFFF";
        }
        else{
            let c = createColor(r).split(",");
            r = rgbToHex(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]));
            rColor = r;
        }
    }
    else{
        rColor = "#FFFFFF";
        r = "none";
    }
    

    $("#color").val(rColor);
    $("#colorText").val(r);
}

$("#color").on("input", function(){
    let val = $(this).val().toString().toUpperCase();
    $("#colorText").val(val);

    let svg = $("#svg").val();
    if(svg.search("fill=") == -1){
        svg = svg.replace(/<path /gmi, '<path fill="'+val+'" ');
    }
    else{
        svg = svg.replace(/fill="(.*?)"/gmi, 'fill="'+val+'"');
    }
    
    $("#svg").val(svg);
    svgInput();
});

$("#colorText").on("input", function(){
    let val = $(this).val().toString().toUpperCase();
    if(val.search("rgb") > -1){
        let c = val.replace(/(rgb\(|\)| )/g, '').split(",");
        val = rgbToHex(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]));
    }
    else if(val.search("#") > -1){
        console.log('hex');
    }
    else if(val == "CURRENTCOLOR"){
        r = "currentColor";
        val = "#FFFFFF";
    }
    else{
        console.log('other');
        let c = createColor(val).split(",");
        val = rgbToHex(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]));
    }
    $("#color").val(val);

    let svg = $("#svg").val();
    
    if(val == "CURRENTCOLOR") svg = svg.replace(/fill=(?:'|")(.*?)(?:'|")/gmi, 'fill="currentColor"');
    else svg = svg.replace(/fill=(?:'|")(.*?)(?:'|")/gmi, 'fill="'+val+'"');
    $("#svg").val(svg);
    svgInput(1);
});

$(".preview-color").click(function(){
    let id = $(this).data("id");
    $(".svg-preview").removeClass("white black");
    if(id !== "default") $(".svg-preview").addClass(id);
});

function getPathFromSvg(svg, dd){
    d = document.createElement("div");
    document.body.appendChild(d);
    d.innerHTML = svg;
    d.id = "svgPathTitle";
    let path = document.querySelector("#svgPathTitle svg").innerHTML.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    

    if(dd){
        let data = '';
        document.querySelectorAll("#svgPathTitle svg path").forEach(function(e){
            data += e.getAttribute("d") + " ";
        });
        data = data.slice(0, -1);
        document.body.removeChild(d);
        return data;
    }
    document.body.removeChild(d);
    path = path.replace(/svg/gi,'<qteg>svg</qteg>');
    path = path.replace(/path/gi,'<qteg>path</qteg>');
    path = path.replace(/viewBox=(?:'|")(.*?)(?:'|")/gi,'<qattr>viewBox</qattr>=<qstr>"$1"</qstr>');
    path = path.replace(/width=(?:'|")(.*?)(?:'|")/gi,'<qattr>width</qattr>=<qclr>"$1"</qclr>');
    path = path.replace(/height=(?:'|")(.*?)(?:'|")/gi,'<qattr>height</qattr>=<qclr>"$1"</qclr>');
    path = path.replace(/fill=(?:'|")(.*?)(?:'|")/gi,'<qattr>fill</qattr>=<qclr>"$1"</qclr>');
    path = path.replace(/d=(?:'|")(.*?)(?:'|")/gi,'<qattr>d</qattr>=<qstr>"$1"</qstr>');
    path = path.replace(/\n    /g, '');
    return path;
}

function svgInput(s){
    let val = $("#svg").val();

    if(val == "" || val.search("<svg") == -1) {
        $("#result").hide();
        $("#html, #imgtag, #svgpath, #css, #cssurl, #cssimg, #encoded").empty();
        return false;
    }
    $("#result").show();
    $("#html").html(clear(val));
    $("#imgtag").html(clear(val, "svgimg"));
    $("#svgpath").html(getPathFromSvg(val));

    $("#css").html(clear(val, "cssbg"));
    $("#cssurl").html(clear(val, "cssurl"));
    $("#cssimg").html(clear(val, "dataimg"));
    $("#encoded").html(clear(val, "encoded"));

    let clearimg;
    if(val.search("fill=") == -1){
        let val1 = val.replace(/<path /gmi, '<path fill="#fff" ');
        clearimg = clear(val1, "dataimgClear");
    }else{
        clearimg = clear(val, "dataimgClear").replace('currentColor', '%23fff');
    }
    $(".svg-preview img").attr("src", clearimg);

    if(s == undefined){
        getFill(val);

        if(val.search("width") !== -1){
            let m = val.match(/width=(?:'|")\d+(?:'|")/gmi);
            if(m) $("#width").val(m[0].replace(/\D/g,''));
        }
        else $("#width").val('');
        if(val.search("height") !== -1){
            m = val.match(/width=(?:'|")\d+(?:'|")/gmi);
            if(m) $("#height").val(m[0].replace(/\D/g,''));
        }
        else $("#height").val('');
    }
}
$("#svg").on("input", function(){
    svgInput();
});

$("#width, #height").on("input", function(e){
    let val = $(this).val();
    let type = e.target.id;
    
    if(!val) return false;
    let svg = $("#svg").val();

    if($("#ratio").is(":checked")){
        $("#height").val(val);

        if(svg.search("width") > -1 && svg.search("height") > -1){
            svg = svg.replace(/width=(?:'|")\d+(?:'|")/gmi, 'width="'+val+'"');
            svg = svg.replace(/height=(?:'|")\d+(?:'|")/gmi, 'height="'+val+'"');
            $("#svg").val(svg);
            svgInput(1);
        }
        else if(svg.search("width") > -1 && svg.search("height") < 0){
            svg = svg.replace(/<svg /gmi, '<svg height="'+val+'" ');
            svg = svg.replace(/width=(?:'|")\d+(?:'|")/gmi, 'width="'+val+'"');
            svg = svg.replace(/height=(?:'|")\d+(?:'|")/gmi, 'height="'+val+'"');
            $("#svg").val(svg);
            svgInput(1);
        }else if(svg.search("height") > -1 && svg.search("width") < 0){
            svg = svg.replace(/<svg /gmi, '<svg height="'+val+'" ');
            svg = svg.replace(/width=(?:'|")\d+(?:'|")/gmi, 'width="'+val+'"');
            svg = svg.replace(/height=(?:'|")\d+(?:'|")/gmi, 'height="'+val+'"');
            $("#svg").val(svg);
            svgInput(1);
        }
        else{
            svg = svg.replace(/<svg /gmi, '<svg width="'+val+'" ');
            svg = svg.replace(/<svg /gmi, '<svg height="'+val+'" ');
    
            $("#svg").val(svg);
        }
    }
    else{
        if(svg.search("width") !== -1 && type == "width"){
            svg = svg.replace(/width=(?:'|")\d+(?:'|")/gmi, 'width="'+val+'"');
            $("#svg").val(svg);
            svgInput(1);
        }
        else if(svg.search("height") !== -1 && type == "height"){
            svg = svg.replace(/height=(?:'|")\d+(?:'|")/gmi, 'height="'+val+'"');
            $("#svg").val(svg);
            svgInput(1);
        }
        else{
            if(type == "width") svg = svg.replace(/<svg /gmi, '<svg width="'+val+'" ');
            if(type == "height") svg = svg.replace(/<svg /gmi, '<svg height="'+val+'" ');
    
            $("#svg").val(svg);
        }
    }
    
    
});

function minify(svg){
    return svg.replace(/\>[^\S ]+/sgm,'>').replace(/[^\S ]+\</sgm,'<').replace(/(\s)+/sgm,' ');
}

$("#mergeBtn").click(function(){
    let val = $("#svg").val();
    if(val == "") return false;
    let oldPath = getPath(val);
    let paths = getPathFromSvg(val, 1);
    if(oldPath){
        if(oldPath.length <= 1) return false;
        for(let path of oldPath) val = val.replace(path, '').replace(/<\/path>/gmi, '');
        if(val.search(paths) == -1){
            val = val.replace(/<\/svg>/gmi, '<path fill="'+$("#colorText").val()+'" d="' + paths + '"></path></svg>');
            $("#svg").val(minify(val));
            // $("#svg").val(minify(val));
            svgInput(1);
        }
        
    }
});

$(".darklight").click(function(){
    $("body").toggleClass("light");
})

function m(){
    $("#svg").val(minify($("#svg").val()));
    svgInput();
}

function AspectRatio(){
    let checked = $("#ratio").is(":checked");
    if(checked){
        $("#height-inner").addClass("op7");
        $("#height").attr("disabled", "");

        if($("#width").val() == "") $("#width").val($("#height").val());
        else $("#height").val($("#width").val());
    }else{
        $("#height-inner").removeClass("op7");
        $("#height").removeAttr("disabled");
    }
}

$("#ratio").on("change", AspectRatio);
function toCurrentColor(){
    $("#colorText").val("currentColor");
    $("#color").val("#FFFFFF");
    let svg = $("#svg").val();
    svg = svg.replace(/fill=(?:'|")(.*?)(?:'|")/gmi, 'fill="currentColor"');
    $("#svg").val(svg);
    svgInput();
}
function down(){
    if($(".svg-preview img").attr('src') == "") return false;

    let link = document.createElement('a');
    link.href = $(".svg-preview img").attr('src');
    link.download = 'icon.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function copy(id, e) {
    e.target.innerText = "Copied";
    setTimeout(() => {
        e.target.innerText = "Copy";
    }, 3000);
    let text = $("#"+id).text();
    let input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}
