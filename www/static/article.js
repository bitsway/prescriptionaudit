var apipath="http://127.0.0.1:8000/skf/prescription_sync/";

$(document).ready(function(){
	
	if(localStorage.user_id==undefined){
		url = "#loginPage";
		$.mobile.navigate(url);
	}else{
		url = "#homePage";
		//url = "#doctor_search_page";
		$.mobile.navigate(url);
	}
	
	//$('#listChk').load("search.html");	
	//alert($("#selectedMedicineUL li").val());
	
});



function syncBasic() {
					
		var cid=$("#cid").val() ;
	 	var user_id=$("#user_id").val() ;
	 	var user_pass=$("#user_pass").val() ;
		if (cid=="" || user_id=="" || user_pass==""){
			 $(".errorChk").html("Required cid user id and password");	
		 }else{	
			 $('#syncBasic').hide();			 
			 $(".errorChk").html("Sync in progress. Please wait...");
			
			if(localStorage.sync_code==undefined || localStorage.sync_code==""){
					localStorage.sync_code=0
				}
			
		 	//alert(apipath+'passwordCheck?cid='+cid+'&user_id='+user_id+'&user_pass='+encodeURI(user_pass)+'&sync_code='+localStorage.sync_code);
			
			$.ajax({
				url:apipath+'passwordCheck?cid='+cid+'&user_id='+user_id+'&user_pass='+encodeURI(user_pass)+'&sync_code='+localStorage.sync_code,
			  	success: function(result) {
					if (result=='YES'){						
						localStorage.user_id=user_id;
						
						$(".errorChk").html("Sync Successful");						
						
						var url = "#homePage";
						$.mobile.navigate(url);
					}
					else {
						
						$(".errorChk").html("Sync Failed. Authorization or Network Error.");
						$('#syncBasic').show();
					}
				
				}
			});//------/ajax 
		 
		 }//-----/field
			
	}


$("#imgList li").click(function(){
	var img_path = $('img', this).attr('src');
	localStorage.setItem('prescriptionImg', img_path);
	$("#largeImageSee").attr("src", img_path);
		url = "#first_page";
		$.mobile.navigate(url);
});

function medListShow(){
	url = "#second_page";
	$.mobile.navigate(url);	
	}
/////////////////////////////////////////////////////////////////
function goDoctor(){
	url = "#doctor_search_page";
	$.mobile.navigate(url);
	$("#docNext").hide();
}

function searchDoctor(){
	var searchValue = $("#docSearchId").val();
	if(searchValue.length<3){}
	else{
		$.ajax({
			  url: apipath+'search_doctor?cid=SKF&sync_code='+localStorage.sync_code+'&searchValue='+searchValue,
			  success: function(resStr) {
				if (resStr!=""){
					keywordStr=resStr.split("||");
					//alert(keywordStr); 
					  var keywordS='';
					  keywordS+='<ul id="drListUl">'
					  for (i=0;i<keywordStr.length;i++){
						  keywordLi=keywordStr[i].split("-")
						  
						  var doctorId=keywordLi[0];
						  var doctorName=keywordLi[1];
						  var doctorArea=keywordLi[2];
						  var doctorAddress=keywordLi[3]
						  //  data-role="button"  border:1px solid #00e6e6;
						  keywordS+='<li onclick="listClick(\''+doctorId+'\',\''+doctorName+'\',\''+doctorArea+'\',\''+doctorAddress+'\')">'
						  keywordS+='<h4 style="margin-bottom:10px; " >'+doctorName+'</h4>'
						  keywordS+='<p>'+doctorAddress+'</p>'
						  keywordS+='</li>'
						  
					  }
					  keywordS+='</ul>'
					  
					$('#doctorAdd').empty();
					$('#doctorAdd').append(keywordS).trigger('create');
					 
					$(".error").text("");
					 
					  url="#doctor_search_page";					
					  $.mobile.navigate(url);
				
				
				}else{
					$(".error").text("Invalid keywords");
				}
			
			  }
			
		});
	}
}

function listClick(doctorId, doctorName, doctorArea, doctorAddress){
		var doc =  doctorId+' <dddd> '+doctorName+' <dddd> '+doctorArea+' <dddd> '+doctorAddress;
		localStorage.setItem('docInfo', doc);
		$("#docNext").show();
		
	}
	
function nextDoctor(){
		url = "#product_sumary_page";
		$.mobile.navigate(url);
		var medListReceive = localStorage.getItem('item');
		var docInfoReceive = localStorage.getItem('docInfo');
		var prescriptionImg = localStorage.getItem('prescriptionImg');
		
		var docInfoReceiveBr = docInfoReceive.split('<dddd>');
		var medListReceiveBr = medListReceive.split(',');
		var docName, docAddress, medName;
		for(i=0; i<docInfoReceiveBr.length; i++){
			docName = docInfoReceiveBr[1];
			docAddress = docInfoReceiveBr[3];
		}
		//alert(medListReceiveBr);
		for(i=0; i<medListReceiveBr.length; i++){
			medName = medListReceiveBr[i];
			//alert(medName);
			$("#sumaryMed").append("<li>"+medListReceiveBr[i]+"</li>");
		}
		
		$("#sumaryDoc").html("<h4>"+docName+"</h4><p>"+docAddress+"</p>");
		$("#sumaryPic").html("<img src="+prescriptionImg+" />");
	}

function summarySubmit(){
		var medcineSub = localStorage.getItem('item');
		var medcineSubBr = medcineSub.split(',');
		var brandName, genericName, formationName, companyName; 
		for(i=0; i<medcineSubBr.length; i++){
			var medNameBr = medcineSubBr[i].split('|');
			//alert(medNameBr);
			for(j=0; j<medNameBr.length; j++){
				brandName = medNameBr[0];
				//alert(brandName);
			}
		}
}



var ul = document.getElementById('myUL');
var optionVal = new Array();
ul.onclick = function(event){
	var target = event.target.innerHTML;
	if(optionVal.indexOf(target)==-1){
		optionVal.push(target);
	}
	localStorage.setItem('item', optionVal);
};


function checkListLoad(){
		
		var nVal = localStorage.getItem('item');
		var medList='<ul id="selectedMedicineUL">';
		var valBr = nVal.split(',');
		for(i=0; i < valBr.length; i++){
			medList+='<li><a href="#">'+valBr[i]+'</a></li>';
			
		}
		medList+='</ul>';
		
		
		$("#selectedMedicine").empty();
		$('#selectedMedicine').append(medList).trigger('create');
		
		var optionVal = new Array();
		 $("ul[id*=selectedMedicineUL] li").click(function(){
			$(this).remove();
		 });
		url = "#third_page";
		$.mobile.navigate(url);
		 
}



/*camera area start*/
function takePicture(){
	//alert();
navigator.camera.getPicture( cameraSuccess, cameraError, {
		quality: 90,
		targetWidth: 400,
       // destinationType: Camera.DestinationType.FILE_URI,
		destinationType: Camera.DestinationType.FILE_URI,correctOrientation: true ,
        correctOrientation: true,
        saveToPhotoAlbum: true
    }); 
	
}

function onSuccessA(uri) {
    var image = document.getElementById('myImage1');
    image.src = uri;
	myImage1 = uri;
	localStorage.setItem('prescriptionImg', myImage1);
	
	$("#myImage1").val(myImage1);
	
	//uploadPhoto()
}

/*localStorage.picFlag=0;

function cameraSuccess(uri){  
	var picNo=parseInt(localStorage.picFlag)+1 
	var imageDiv="myImage"+picNo
	var imageText="prPhoto"+picNo
	localStorage.picFlag=picNo
	var image = document.getElementById(imageDiv);
	image.src = uri;
	imagePath = uri;
	
	//alert (uri)
	//takePicture();
	
    
	$("#"+imageText).val(imagePath);
        
}
*/
function cameraError(message){
    alert("Canceled!"); 
	
}
/*camera area end*/

var options = {
		  valueNames: [ 'name', 'born', 'location' ]
		};

var userList = new List('users', options);


// upload photo
function uploadPhoto(imageURI, imageName) {	
	//winAch();
	//alert(imageURI)
    var options = new FileUploadOptions();
    options.fileKey="upload";
    options.fileName=imageName;
    options.mimeType="image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;
	
	options.chunkedMode = false;

    var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://i01.businesssolutionapps.com/welcome/plan_survey_sync/fileUploader/"),winAch,fail,options);
	
}
