console.log("sf_rec_details.js");
drawFingerPrintOnCanvas = function(fgCanvas, bytes, width, height) {
	if (!width) { width = 500; }
	if (!height) { height = 500;}	
	  if (fgCanvas._clipDiv.children[0].childElementCount == 0) {
	  	  var canvas = document.createElement("Canvas");
	  	  canvas.height= width;
	  	  canvas.width = height;
	  	  fgCanvas._clipDiv.children[0].appendChild(canvas);
	  }
	  var ctx = fgCanvas._clipDiv.children[0].children[0].getContext('2d');
	  var imgData= ctx.createImageData(width, height);
	  if (typeof bytes == "string") {
		  var frameBytes = bytes;
		  for(var i = 0; i < frameBytes.length; i++) {
			  var x = Math.floor(i / width) * 500 + Math.floor((i%width) / width * 500);
		      imgData.data[4*i] = frameBytes.charCodeAt(x); // red
		      imgData.data[4*i + 1] = frameBytes.charCodeAt(x); // green
		      imgData.data[4*i + 2] = frameBytes.charCodeAt(x); // blue
		      imgData.data[4*i + 3] = 255; // alpha
		  }
	  } else {
		  var frameBytes = new Uint8Array(bytes);
		  for(var i = 0; i < frameBytes.length; i++) {
			  var x = Math.floor(i / width) * 500 + Math.floor((i%width) / width * 500);
		      imgData.data[4*i] = frameBytes[x]; // red
		      imgData.data[4*i + 1] = frameBytes[x]; // green
		      imgData.data[4*i + 2] = frameBytes[x]; // blue
		      imgData.data[4*i + 3] = 255; // alpha
		  }
	  }
	  ctx.putImageData(imgData, 0, 0, 0, 0, width, height);
};

isc.DynamicForm.create({
	ID:"sfRecFormDetail",
	dataSource: "seafarerDS",
//	cellBorder:1,
	numCols: 8,
	colWidths: ["1", "1", "1", "1", "1", "1", "1", "1"],
	fields: [
		{name: "partType", title:"Part Type", type: "radioGroup", valueMap: {"1":"Part 1", "2":"Part 2"}, colSpan: 3, vertical: false},
		{name: "serbNo", title:"SERB No.", type: "staticText", startRow: true, width: 70},
		{name: "serbDate", title:"SERB Date", displayFormat:"dd/MM/yyyy", width:100, disabled:true},
//		{name: "serb_photo", title: "photo", type: "button", startRow: false, endRow: false, width: 70},
//		{name: "serb_thumbs", title: "thumbs", type: "button", startRow: false, endRow: false, width: 70},
		{name: "surname", 	title:"Surname",	startRow: true, required: true, colSpan: 3, width: 180},
		{name: "firstName", title:"First Name",	startRow: false, required: true, colSpan: 2, width: 140},

		{name: "chiName", 	title:"Chinese Name",	startRow: true, colSpan: 3, width: 180},
		{name: "nationalityId", title: "Nationality", type: "text", startRow: false, width: 140,	colSpan: 2,
			optionDataSource:"nationalityDS", valueField:"id", displayField:"engDesc", allowEmptyValue:true
		},

		{name: "ccc1", title: "CCC Code", type: "text", startRow: true, width: 70, colSpan: 1},
		{name: "ccc2", showTitle: false, type: "text", startRow: false, width: 70, colSpan: 1},
		{name: "ccc3", showTitle: false, type: "text", startRow: false, width: 70, colSpan: 1},
		{name: "ccc4", showTitle: false, type: "text", startRow: false, width: 70, colSpan: 1},

		//				{name: "nationalityEngDesc", title: "Nationality", showTitle: false, type: "text", startRow: false, width: 120},
		{name: "province", title:"Province", allowEmptyValue:true,  startRow: false, width: 170, colSpan:4, hidden:true},
		{name: "serialPrefix", title: "Serial No.", type: "text", width: 50, startRow:true},
		{name: "serialNo", title: "Serial No", showTitle: false, type: "text", colSpan: 2, startRow: false, width: 140},

		{name: "id", title: "HKID", editorType: "TextItem", required: true, startRow: true, colSpan: 3},
		{name: "sex", title: "Sex", type: "radioGroup", valueMap: {"M":"Male", "F":"Female"}, vertical:false, startRow: true, colSpan: 2},

		{name: "birthDate", title:"Birth Date", displayFormat:"dd/MM/yyyy",startRow: true, colSpan: 2, endRow:true},
		{name: "birthPlaceGroup", title:"", type:"radioGroup", vertical:false,
			valueMap:{"HONG KONG":"HONG KONG", "CHINA":"CHINA", "MACAU":"MACAU"}, endRow:true,
			changed: function(form, item, value){
				console.log("birth place group: " + value);
				form.getField("birthPlace").setValue(value);
			}},
		{name: "birthPlace", title: "Birth Place", allowEmptyValue:true, colSpan: 2},

		{name: "maritalStatus", title: "Marital Status", valueMap: {"SINGLE":"Single", "MARRIED":"Married", "WIDOWED":"Widowed", "DIVORCED":"Divorced"}, allowEmptyValue:true, type: "select", colSpan: 4},
//		{name: "passportNo", title: "Passport No", type: "text", startRow: true, colSpan: 2},
//		{name: "sibNo", title:"SIB No.", colSpan: 2},
		{name: "telephone", title:"Telephone", startRow: true, colSpan: 5, width:350},
//		{name: "mobile", title: "Mobile", type: "text", colSpan: 2},

		{name: "address1", title: "Address", type: "text", startRow: true, colSpan: 8, width: 400},
		{name: "address2", title: " ", startRow: true, colSpan: 8, width: 400},
		{name: "address3", title: " ", startRow: true, colSpan: 8, width: 400},

		{name: "mailAddress1", title: "Mail Address", type: "text", startRow: true, colSpan: 8, width: 400},
		{name: "mailAddress2", title: " ", type: "text", startRow: true, colSpan: 8, width: 400},
		{name: "mailAddress3", title: " ", type: "text", startRow: true, colSpan: 8, width: 400}
]
});

//Upload Photo Window - start
var sfImages = isc.TabSet.create({
	width:500,
	height:500,
});

sfImages.addTab({title:"Front", pane:isc.Img.create({
    width:180, height:240, border:"1px solid gray", autoFit:true, imageStyle:"stretch",
    imageType: "normal", overflow:"scroll", ID:"sfPhotoCanvas"
})});
sfImages.addTab({title:"Side",pane:isc.Img.create({
	width:180, height:240, border:"1px solid gray", autoFit:true, imageStyle:"stretch",
    imageType: "normal", overflow:"scroll", ID:"sfSidePhotoCanvas"
})});
sfImages.addTab({title:"Left", pane:isc.Canvas.create({width:240, height:240, ID:"sfLeftFingerprintCanvas"})});
sfImages.addTab({title:"Right", pane:isc.Canvas.create({width:240, height:240, ID:"sfRightFingerprintCanvas"})});

isc.HLayout.create({
	ID:"sfRecHLayout", membersMargin:5,
	members:[sfRecFormDetail, sfImages]
});

isc.Window.create({
	ID:"uploadSeafarerPhotoWindow", isModal: true, showModalMask: true, width: 600, height: 300, layoutMargin:10, title:"Upload Photo",
	items: [
	        isc.VLayout.create({
	        	members: [
	        	          isc.Img.create({width:"100%", height:"*", border:"1px solid gray", imageType: "normal", src: "#", ID:"imgPreview"}),
	        	          isc.DynamicForm.create({
	        	        	  ID:"uploadSeafarerPhotoDynamicForm", dataSource: "dmsDataDS", width:"95%", numCols:4, cellBorder:0, colWidths: ["50", "*", "100", "100"], height:20,
	        	        	  fields:[
	        	        	          {name:"id", 		showIf:"false"},
	        	        	          {name:"name", 	showIf:"false"},
	        	        	          {name:"type", 	showIf:"false", value:"photo"},
	        	        	          {name:"content", 	title:"Photo", type:"imageFile", accept:"image/*", canEdit:true, required:true, width:"*", startRow:true, endRow:false,
	        	        	        	  click:function(){
	        	        	        		console.log("------->");
	        	        	        	  },
	        	        	        	  changed:function(form, item, value){
	        	        	        		  var uFiles = item.uploadItem.$14x.files
	        	        	        		  if(uFiles && uFiles[0]) {
	        	        	        	            var reader = new FileReader();
	        	        	        	            reader.onload = function (e) {
	        	        	        	            	imgPreview.setSrc(e.target.result);
	        	        	        	            }
	        	        	        	            reader.readAsDataURL(uFiles[0]);
	        	        	        	            uploadSeafarerPhotoDynamicForm.getField('updatePhotoFormSaveButton1').setDisabled(false);
	        	        	        	            uploadSeafarerPhotoDynamicForm.getField('updatePhotoFormSaveButton2').setDisabled(false);
	        	        	        	        }
	        	        	        	  }
	        	        	          },
	        	        	          {name:"updatePhotoFormSaveButton1", title: "Save Front", type: "button", startRow:false, endRow:false, width:100,
	        	        	        	  click: function (form, item) {
	        	        	        		  form.getData().type="FRONT";
	        	        	        		  form.getData().filename=form.getData().content;
	        	        	        		  form.saveData(function(dsResponse, data, dsRequest){
	        	        	        			  if(dsResponse.status==0){
	        	        	        				  isc.say("Update Photo successfully!");
	        	        	        			  }else{
	        	        	        				  isc.warn("Update Photo fail!");
	        	        	        			  }
	                                            }
	                                           );
	        	        	        	  }
	        	        	          },
	        	        	          {name:"updatePhotoFormSaveButton2", title: "Save Side", type: "button", startRow:false, endRow:false, width:100,
	        	        	        	  click: function (form, item) {
	        	        	        		  form.getData().type="SIDE";
	        	        	        		  form.saveData(function(dsResponse, data, dsRequest){
	        	        	        			  if(dsResponse.status==0){
	        	        	        				  isc.say("Update Photo successfully!");
	        	        	        			  }else{
	        	        	        				  isc.warn("Update Photo fail!");
	        	        	        			  }
	                                            }
	                                           );
	        	        	        	  }
	        	        	          },
	        	        	          ]
	        	          })
	        	          ]
	        })
	        ],
	  show:function(){
		  this.Super('show', arguments);
		  imgPreview.setSrc('');
		  var seafarerId = sfRecFormDetail.getValue('id');
		  uploadSeafarerPhotoDynamicForm.setValues({id:seafarerId});
		  uploadSeafarerPhotoDynamicForm.getField('updatePhotoFormSaveButton1').setDisabled(true);
		  uploadSeafarerPhotoDynamicForm.getField('updatePhotoFormSaveButton2').setDisabled(true);
	  }
});
//Upload Photo Window - End

//Upload Fingerprint Window - Start
isc.Window.create({
	ID:"uploadSeafarerFingerprintWindow", isModal: true, showModalMask: true, width: 500, height: 450, layoutMargin:20, title:"Upload Fingerprint",
	bodyDefaults:{membersMargin:15},
	items: [
	        isc.Canvas.create({width:250, height:250, ID:"fgCanvas"}),
	        isc.DynamicForm.create({
	        	ID:"uploadSeafarerFingerprintDynamicForm", width:"100%", numCols:5, cellBorder:0, colWidths: ["50", "50", "50", "50", "50"],
	        	fingerprintHttpServer:"http://127.0.0.1:15270/fpoperation", //TODO
	        	upload:function(type) {
	        		if (uploadSeafarerFingerprintDynamicForm.fingerprint &&
	        				uploadSeafarerFingerprintDynamicForm.fingerprint.byteLength == 250000) {
	        			var tob64 = function ( buffer ) {
	        				var binary = '';
	        				var bytes = new Uint8Array( buffer );
							var len = bytes.byteLength;
							for (var i = 0; i < len; i++) {
        					binary += String.fromCharCode( bytes[ i ] );
        					}
							return window.btoa( binary );
						};
						var content = tob64(uploadSeafarerFingerprintDynamicForm.fingerprint);
						dmsDataDS.addData(null, function(resp, data, req) {
							if(resp.status==0){
								isc.say("Update Fingerprint successfully!");
							} else {
								isc.warn("Update Fingerprint fail!");
							}
						}, {data:{id:sfRecFormDetail.getValue("id"), content:content, type:type}, operationId:"fingerprint"});
        		  } else {
        			  isc.warn("Please scan fingerprint first");
        		  }
        		},
        		fields:[
        		        {name:"id", 		showIf:"false"},
	        	        {name:"name", 	showIf:"false"},
	        	        {name:"type", 	showIf:"false", value:"fingerprint"},
	        	        {name:"lfd", 		title:"LFD", 	type:"checkbox", labelAsTitle:true, width:50},
	        	        {name:"invert", 	title:"Invert", type:"checkbox", labelAsTitle:true, width:50},
	        	        {name:"captureButton", 	title:"Capture", type:"button", startRow:false, endRow:false,
	        	        	click:function(form, item){form.beginOperation(form, 'capture');}},
        	        	{name:"saveButtonL", 		title: "Save Left Finger", 	type: "button", startRow:false,endRow:false,colSpan:2,
	        	        		click:function(form, item) { uploadSeafarerFingerprintDynamicForm.upload("LEFT");}},
    	        		{name:"saveButtonR", 		title: "Save Right Finger", 	type: "button", startRow:false,endRow:false,colSpan:2,
	        	        			click:function(form, item) { uploadSeafarerFingerprintDynamicForm.upload("RIGHT");}},
	        			{name:"status", 	showTitle:false, type:"staticText", width:"*", colSpan:5, width:"*", startRow:true}
        			],
    			beginOperation:function(form, opName){
        		  var json = JSON.stringify({operation: opName, lfd: ( form.getValue('lfd')==true ? "yes" : "no" ), invert: ( form.getValue('invert')==true ? "yes" : "no" )});
        		  form.enableControlsForOp(form, true);
        		  var req = new XMLHttpRequest();
        		  req.open("POST", form.fingerprintHttpServer);
        		  req.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        		  req.onload = function() {
        		      if(req.status == 200) {
        		    	  form.setValue('status', "Operation begin.");
        		    	  form.parseOperationDsc(form, JSON.parse(req.response));
        		      }
        		      else {
        		    	  form.setValue('status', "Server response-("+req.statusText+")");
        		    	  form.enableControlsForOp(form, false);
        		      }
        		  };
        		  req.onerror = function() {
        			  form.setValue('status', "Fingerprint Server not available!");
        			  form.enableControlsForOp(form, false);
        		  };
        		  req.send(json);
        		},
        		enableControlsForOp:function(form, opBegin){
        			form.getField('captureButton').setDisabled(opBegin);
    			},
    			parseOperationDsc:function(form, opDsc) {
    				var res = true;

        		    if(opDsc.state == 'done') {
        		        form.enableControlsForOp(form, false);
        		        if(opDsc.status == 'success') {
        		        	form.setValue('status', "Success: "+opDsc.message + ", NFIQ: " + opDsc.nfiq);
        					if(opDsc.operation == 'capture' ){
        						form.linkOperationImage(form, opDsc.id);
        						uploadSeafarerFingerprintDynamicForm.getField('saveButtonL').setDisabled(false);
        						uploadSeafarerFingerprintDynamicForm.getField('saveButtonR').setDisabled(false);
        					}
        		        }
        		        if(opDsc.status == 'fail') {
        		            form.setValue('status', "Fail: "+opDsc.errorstr);
        		            res = false;

        		            if(parseInt(opDsc.errornum) != -1) {
        		                deleteOperation(form, opDsc.id);
        		            }
        		        }
        		    }
        		    else if(opDsc.state == 'init') {
//				        				lastInitOp = opDsc.id
        		        setTimeout(form.getOperationState, 1000, form, opDsc.id);
        		        setTimeout(form.getOperationImg, 1000, form, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight));
        		    }
        		    else if(opDsc.state == 'inprogress')
        		    {
        		        if(opDsc.fingercmd == 'puton') {
        		            isc.say("Put finger on scanner");
        		        }

        		        if(opDsc.fingercmd == 'takeoff') {
        		            isc.say("Take off finger from scanner");
        		        }
        		        setTimeout(form.getOperationState, 1000, form, opDsc.id);
        		        setTimeout(form.getOperationImg, 1000, form, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight));
        		    }
        		    return res;
        		},
        		linkOperationImage:function(form, opId){
        			var target = "/image";
        		    var saveAs = "image.bin"
        		    var resultText = "Result raw image"
        		    var url = form.fingerprintHttpServer + '/' + opId + target;
        		},
        		getOperationState:function(form, opId) {
        		    var url = form.fingerprintHttpServer + '/' + opId;
        		    var req = new XMLHttpRequest();
        		    req.open('GET', url);
        		    req.onload = function() {
        		      if (req.status == 200) {
        				if( req.readyState == 4 ) {
        					form.parseOperationDsc(form, JSON.parse(req.response));
        				}
        		      }
        		      else {
        				form.setValue('status', "Server response-("+req.statusText+")");
        				form.enableControlsForOp(form, false);
        		      }
        		    };
        		    req.onerror = function() {
        		    	form.setValue("Status", "Fingerprint Server not available!");
        				form.enableControlsForOp(form, false);
        		    };
        		    req.send();
        		},
        		getOperationImg:function(form, opId, frameWidth, frameHeight) {
        		    var url = form.fingerprintHttpServer + '/' + opId + '/image';
        		    var req = new XMLHttpRequest();
        		    req.open('GET', url);
        		    req.onload = function() {
        		      if (req.status == 200) {
        		    	  // TODO req.response is new ArrayBuffer(250000)
        		    	  uploadSeafarerFingerprintDynamicForm.fingerprint =req.response;
        		    	  drawFingerPrintOnCanvas(fgCanvas, req.response, 250,250);
        		      }else {
        		    	  form.enableControlsForOp(form, false);
        		      }
        		    };
        		    req.onerror = function() {
        		    	form.enableControlsForOp(form, false);
        		    };
        		    req.send();
        			req.responseType = "arraybuffer";
        		},
        		deleteOperation:function(form, opId){
        			var url = form.fingerprintHttpServer + '/' + opId;
        			var req = new XMLHttpRequest();
        		    req.open("DELETE", url);
        		    req.onload = function() {
        		    if (req.status == 200){
        		    	//TODO noting to do.
        		    }else {
        		        form.setValue('status', "Server response-("+req.statusText+")");
        		      }
        		    };
        		    req.onerror = function(){
        		      form.setValue('status', "Fingerprint Server not available!");
        		    };
        		    req.send();
        		}
    		}) // Form end
		],
		show:function(){
	 		this.Super('show', arguments);
	 		uploadSeafarerFingerprintDynamicForm.setValues({});
	 		var seafarerId = sfRecFormDetail.getValue('id');
	 		uploadSeafarerFingerprintDynamicForm.setValues({id:seafarerId});
			uploadSeafarerFingerprintDynamicForm.getField('saveButtonL').setDisabled(true);
			uploadSeafarerFingerprintDynamicForm.getField('saveButtonR').setDisabled(true);
	  	}
});
//Upload Fingerprint Window - End



isc.ButtonToolbar.create({
	ID:"sfRecFormButton_ToolBar",
	buttons: [
			  {name:"uploadFingerprintBtn", title:"Upload Fingerprint", autoFit: true, onControl:"MMO_CREATE|MMO_UPDATE",
				  click : function () {
					  uploadSeafarerFingerprintWindow.show();
					  }
			  },
			  {name:"uploadPhotoBtn", title:"Upload Photo", autoFit: true, onControl:"MMO_CREATE|MMO_UPDATE",
				  click : function () {
					  uploadSeafarerPhotoWindow.show();
				  }
			  },
	          {name:"saveBtn", title:"Save", autoFit: true, onControl:"MMO_CREATE|MMO_UPDATE",
	        	  click : function () {
	        		  if(sfRecFormDetail.validate()){
	        			  sfRecFormDetail.saveData(
	        					  function (dsResponse, data, dsRequest) {
	        						  if(dsResponse.status==0){
	        							  isc.say(saveSuccessfulMessage);
//	        						  sfRecFormDetail.setValues(data);
	        							  enabledSection(true);
	        						  }
	        					  }
	        			  );
	        		  }
	        	  }
	          },
	          {name:"resetBtn", title:"Reset", autoFit: true,
	        	  click : function () {
	        		  sfRecFormDetail.resetValues();
	        	  }
	          },
	          {name:"closeBtn", title:"Close", autoFit: true,
	        	  click : function () {
	        		sfRecFormDetail.setValues({});
	        		sfRecFormDetail.setData({});
	        		sfRecFormDetail.reset();
	        		sfRecFormDetail.clearErrors(true);
	        		  //TODO
//	        		sfRegListGrid.setData([]);
//	      			sfRecFormNextOfKin.setData([]);
//	      			sfRecFormMedical.setData([]);
//	      			sfRecFormSeaService.setData([]);
//	      			sfRecFormEmployment.setData([]);
//	      			sfRecFormRating.setData([]);
//	      			sfRecFormDisc.setData([]);
//	      			sfPreviousSerbListGrid.setData([]);

	        		  SeafarerDetailWindow.hide();
	        	  }
	          }

	          ]
});


isc.SectionStack.create({
	ID:"sfRecSectionContent", overflow : "auto", alwaysShowScrollbars:false,
	expandSection:function(sections){
		this.Super('expandSection', arguments);
		var secTitle = sections.title;
		if('Personal Information'!=secTitle){
			var resultLG = sfRecSectionContent.getSection(sections.name).items[0].members[0];
			if('ListGrid'==resultLG.getClassName()){
				resultLG.refresh();
			}
		}
	},
	sections: [
	           {name:"seafarerPersonInfo", 	title: "Personal Information", 	resizeable: false, items: [ sfRecHLayout, sfRecFormButton_ToolBar ]},
	           {name:"seafarerReg", 		title: "Registration",			resizeable: false, items: [ seafarerRegLayout ]},
	           {name:"seafarerNextOfKin", 	title: "Next-of-Kin",  			resizeable: false, items: [ seafarerNextOfKinLayout ]},
	           {name:"seafarerMedical",		title: "Medical", 				resizeable: false, items: [ seafarerMedicalLayout ]},
	           {name:"seafarerTrainingCourse",	title: "Training Course", 	resizeable: false, items: [ seafarerCourseLayout ]},
	           {name:"seafarerCert",		title: "Cert/License", 			resizeable: false, items: [ seafarerCertLayout ]},
	           {name:"seafarerSeaService",	title: "Sea Service", 			resizeable: false, items: [ seafarerSeaServiceLayout ]},
	           {name:"seafarerEmployment",	title: "Employment", 			resizeable: false, items: [ seafarerEmploymentLayout ]},
	           {name:"seafarerRank",		title: "Rank/Rating", 			resizeable: false, items: [ seafarerRatingLayout ]},
	           {name:"seafarerSerb",		title: "Previous SERB Record", 	resizeable: false, items: [ seafarerPrevSerbLayout ]},
	           {name:"seafarerDisciplinary",	title: "Disciplinary", 		resizeable: false, items: [ seafarerDiscLayout ]}
	         ]

});

isc.Window.create({
	ID:"SeafarerDetailWindow", isModal: true, showModalMask: true, width: 1200, height: 800, layoutMargin:10,
	items: [
	        isc.VLayout.create({
	        	members: [
	        	        isc.TitleLabel.create({ID:"sfRecSectionTitle", contents: "<p><b><font size=2px>Maintain Seafarer Record <br /></font></b></p>"}),
	        	        sfRecSectionContent
	        	      ]
	        })
	        ],
	show:function(){
		sfRecFormDetail.setData({});
		this.Super('show', arguments);
		sfRecSectionContent.collapseSection([1,2,3,4,5,6,7,8,9,10]);

	},
	hide:function(){
		this.Super("hide", arguments);
		sfPhotoCanvas.setSrc("");
		sfSidePhotoCanvas.setSrc("");
	}

});
SeafarerDetailWindow.sfImages = sfImages;
sfImages.tabSelected=function(tabNum, tabPane, ID, tab, name){
	if (!SeafarerDetailWindow.fpkey) {
		sfPhotoCanvas.setSrc("../images/blank.gif");
		sfSidePhotoCanvas.setSrc("../images/blank.gif");
		sfPhotoCanvas.setSrc("");
		sfSidePhotoCanvas.setSrc("");
		return;
	}
	var drawFp = function(target, type) {
		var req = new XMLHttpRequest();
		req.open("GET", "./dmsImage//?DOC_TYPE=MMO-Seafarer Image&SERB number=" +SeafarerDetailWindow.fpkey+ "&Type=" + type);
		req.onload = function() {
			if(req.status == 200) {
				var image = req.response;
				image = atob(image);
				if (image.length == 250000) {
					drawFingerPrintOnCanvas(target, image, 200, 200);
				}
			}
		};
		req.send()
	};
	switch (tabNum) {
	case 0:
		if(SeafarerDetailWindow.fpkey==null || SeafarerDetailWindow.fpkey==undefined){
			sfPhotoCanvas.setSrc("");
		}else{
			sfPhotoCanvas.setSrc("../dmsImage//?DOC_TYPE=MMO-Seafarer Image&SERB number=" + SeafarerDetailWindow.fpkey+"&Type=" +"Photo-font view&OUTPUT_FORMAT=bytes&QueryDate=" + new Date().getTime());
		}
		break;
	case 1:
		if(SeafarerDetailWindow.fpkey==null || SeafarerDetailWindow.fpkey==undefined){
			sfSidePhotoCanvas.setSrc("");
		}else{
			sfSidePhotoCanvas.setSrc("../dmsImage//?DOC_TYPE=MMO-Seafarer Image&SERB number=" + SeafarerDetailWindow.fpkey+"&Type=" +"Photo-side view&OUTPUT_FORMAT=bytes&QueryDate=" + new Date().getTime());
		}
		break;
	case 2:
		drawFp(sfLeftFingerprintCanvas, "Fingerprint-left");
		break;
	case 3:
		drawFp(sfRightFingerprintCanvas, "Fingerprint-right");
		break;

	}
};

function openSfRecDetail(record){
	//Init the Forms and ListGrids

	SeafarerDetailWindow.show();

	if(record!=null){
		//Update record;
		sfRecFormDetail.getField('id').setDisabled(true);
		var seafarerId = record.id;
		sfRecFormDetail.fetchData(null,function (dsResponse, data, dsRequest) {
			SeafarerDetailWindow.setTitle("Seafarer Detail (ID: " + seafarerId + " )");
//			Note: refresh while click
//			sfRegListGrid.refresh();
//			sfRecFormNextOfKinLG.refresh();
//			sfRecFormMedicalLG.refresh();
//			sfRecFormSeaServiceLG.refresh();
//			sfRecFormEmploymentLG.refresh();
//			sfRecFormRatingLG.refresh();
//			sfRecFormDiscLG.refresh();
//			sfPreviousSerbListGrid.refresh();
		}, {operationId:"singleFetch", data:{"id":seafarerId}});

		sfRecFormButton_ToolBar.getButton('uploadFingerprintBtn').setDisabled(false);
		sfRecFormButton_ToolBar.getButton('uploadPhotoBtn').setDisabled(false);

		enabledSection(true);

		previousSerbDS.fetchData({seafarerId:record.id}, function(resp, data) {
			if (data.isEmpty()) {
				SeafarerDetailWindow.fpkey = null;
				return;
			}
			SeafarerDetailWindow.fpkey = "SERB_" + data[0].serbNo;
			SeafarerDetailWindow.sfImages.selectTab(0);
			SeafarerDetailWindow.sfImages.tabSelected(0);
		});
	}else{
		//New record;
		SeafarerDetailWindow.setTitle("Seafarer Detail (ID: " + seafarerId + " )");
		sfRecFormDetail.getField('id').setDisabled(false);
		sfRecFormDetail.setValues({});
		sfRecFormDetail.clearErrors(true);
		sfRecFormButton_ToolBar.getButton('uploadFingerprintBtn').setDisabled(true);
		sfRecFormButton_ToolBar.getButton('uploadPhotoBtn').setDisabled(true);
		enabledSection(false);
		delete SeafarerDetailWindow.fpkey;
		SeafarerDetailWindow.sfImages.selectTab(0);
		SeafarerDetailWindow.sfImages.tabSelected(0);
	}
}

function enabledSection(isEnabled){
	var listOfSection = ['seafarerReg', 'seafarerNextOfKin', 'seafarerMedical', 'seafarerTrainingCourse', 'seafarerCert', 'seafarerSeaService', 'seafarerEmployment', 'seafarerRank', 'seafarerSerb', 'seafarerDisciplinary'];
	var i;
	for (i = 0; i < listOfSection.length; i++) {
		sfRecSectionContent.getSection(listOfSection[i]).setDisabled(!isEnabled);
	}
}