console.log("load openRegMaster.js");
var thickBtnHeight = 50;
var builderWinWidth = 600;
var builderWinHeight = 320;
var injuctionWinWidth = 480;
var injuctionWinHeight = 180;
var ownerWinWidth = 600;
var ownerWinHeight = 750;
var mortgageWinWidth = 580;
var mortgageWinHeight = 500;

/*	mode == 0 ? "Ship Registration" :
	mode == 1 ? "Re Registration" :
	mode == 2 ? "De Registration" :
	mode == 3 ? "Change Registration Details" :
	mode == 4 ? "Change RP Detail" :
--	mode == 5 ? "Ship Registration" :"Ship Registration";
	mode == 5 ownership change applicaiton

	mode == 6 owner detail change application
	mode == 7 builder detail change application
	mode == 8 new mortgage application
*/

//var openOwnerDetailForm = function(windowTitle, btns, width, height) {
//	var ownerDetailForm = isc.DynamicForm.create
//	var ownerDetailForm_BtnToolbar = isc.ButtonToolbar.create({
//		ID: "ownerDetailForm_Toolbar",
//		buttons:btns
//	});
//	var ownerDetailWindow = isc.window.create({
//		ID: "ownerDetailWindow",
//		title: windowTitle,
//		width: width,
//		height: height,
//		isModal: true,
//		items:[
//			isc.VLayout.create({
//				members:[
//					ownerDetailForm_BtnToolbar
//				]
//			})
//		]
//	});
//};

// add buttons for owner detail
var addBtnOwnerDetailClose = function(item, win, position){
	item.addMember(
		isc.Button.create({
			title:"Close Owner<br>Form",
			height:thickBtnHeight,
			click:function(){
					win.markForDestroy();
					refreshInbox();
			}
		}), position)};
var addBtnOwnerDetailSave = function(item, win, recordNum, ownerGrid, mode, position) {
	item.addMember(
	isc.Button.create(
		{title:"Save<br>Owner Detail",
			height:thickBtnHeight,
			click:function(){
				if (win.form.validate()) {
					var formData = win.form.getData();
//					if (typeof formData.version!="undefined" && formData.applNo){
//						if (recordNum>=0){
//							ownerDS.updataData(formData, function(){
//								ownerDS.fetchData({applNo:formData.applNo}, function(resp, data, req){
//									ownerGrid.setData(data);
//									win.markForDestroy();
//								})
//							})
//						}
//					} else {
//						ownerDS.addData(formData, function(resp, data, req){
//							ownerDS.fetchData({applNo:data.applNo}, function(resp,data,req){
//								ownerGrd.setData(data);
//								win.markForDestroy();
//							});
//						});
//					}
					if (typeof formData.version != "undefined" && formData.applNo) {
//						getTransaction(function(tx) {
//							formData.tx = tx;
//							ownerDS.updateData(null, function() {
//								ownerDS.fetchData({applNo:formData.applNo},function(resp,data,req){
//									ownerGrid.setData(data);
//									win.markForDestroy();
//									refreshInbox();
//								});
//							}, {data:formData});
//						});
						ownerDS.updateData(formData, function(resp, data,req){
							ownerDS.fetchData({applNo:data.applNo}, function(resp,data,req){
								ownerGrid.setData(data);
								if (mode!=5) win.markForDestroy();
							});
						});
					} else if (recordNum >= 0) {
						ownerGrid.getData().removeAt(recordNum);
						ownerGrid.getData().addAt(formData, recordNum);
						if (mode!=5) win.markForDestroy();
						refreshInbox();
					} else {
						if (formData.applNo) {
							ownerDS.addData(formData, function(resp, data, req){
								ownerDS.fetchData({applNo:data.applNo}, function(resp,data,req){
									ownerGrid.setData(data);
									if (mode!=5) win.markForDestroy();
								});
							});
						} else {
							ownerGrid.getData().add(formData);
							if (mode!=5) win.markForDestroy();
						}
					}
//						ownerGrid.getData().add(formData);
//						win.markForDestroy();
//						refreshInbox();
				}
			}
		}), position)};
var addBtnOwnerDetailAmend = function(item, win, recordNum, ownerGrid, position) {
	item.addMember(
		isc.Button.create(
			{title:"Amend<br>Owner Detail",
				height:thickBtnHeight,
				click:function(){
					if (win.form.validate()) {
						var formData = win.form.getData();
						if (typeof formData.version != "undefined" && formData.applNo) {
							getTransaction(function(tx) {
								formData.tx = tx;
								ownerDS.updateData(null, function() {
									ownerDS.fetchData({applNo:formData.applNo},function(resp,data,req){
										ownerGrid.setData(data);
										win.markForDestroy();
										refreshInbox();
									});
								}, {data:formData});
							});
						} else if (recordNum >= 0) {
							ownerGrid.getData().removeAt(recordNum);
							ownerGrid.getData().addAt(formData, recordNum);
							win.markForDestroy();
							refreshInbox();
						} else {
							ownerGrid.getData().add(formData);
							win.markForDestroy();
							refreshInbox();
						}
					}
				}
			}), position)};
var addBtnOwnerDetailCopyCompanySearch = function(item, win, position) {
	item.addMember(
		isc.Button.create({
			title:"Copy from <br>Company Search",
			height:thickBtnHeight,
			click:function(){
				console.log("copy company search");
				openCopyCompanySearchForm("Copy Company Search", function(record){

					if (record.crNumber) {
						if (record.crNumber.startsWith("F")) {
							win.form.getField("overseaCert").setValue(record.crNumber);
						} else {
							win.form.getField("incortCert").setValue(record.crNumber);
						}
					}
					win.form.getField("name").setValue(record.companyName);
					win.form.getField("address1").setValue("");
					win.form.getField("address2").setValue("");
					win.form.getField("address3").setValue("");
					if (record.registeredOffice.length<=80){
						win.form.getField("address1").setValue(record.registeredOffice);
					} else if (record.registeredOffice.length<=160){
						win.form.getField("address1").setValue(record.registeredOffice.substring(0,79));
						win.form.getField("address2").setValue(record.registeredOffice.substring(80,record.registeredOffice.length-1));
					} else {
						win.form.getField("address1").setValue(record.registeredOffice.substring(0,79));
						win.form.getField("address2").setValue(record.registeredOffice.substring(80,159));
						if ( record.registeredOffice.length<=240) {
							win.form.getField("address3").setValue(record.registedOffice.substring(160, record.registeredOffice.length-1));
						} else {
							win.form.getField("address3").setValue(record.registeredOffice.substring(160,239));
						}
					}
				})
			}
		}), position)};
var addBtnOwnerDetailReceiveChange = function(item, win, recordNum, ownerGrid, position){
	item.addMember(
		isc.Button.create({
			title:"Receive<br>Owner Detail<br>Change",
			height:thickBtnHeight,
			click:function(){
				ownerDS.updateData(win.form.getData(), function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_change_receive"});
			},
		}), position)};
var addBtnOwnerDetailAcceptChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Accept<br>Owner Detail<br>Change",
			height:thickBtnHeight,
			click: function() {
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(null, function(){
					win.markForDestroy();
					refreshInbox();
				}, {data:formData, operationId:"ownerDS_change_accept"});
			}
		}), position)};
var addBtnOwnerDetailApproveChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Approve<br>Owner Detail<br>Change",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(null, function() {
					win.markForDestroy();
					refreshInbox();
				}, {data:formData, operationId:"ownerDS_change_approve"});
			}
		}), position)};
var addBtnOwnerDetailWithdrawChange = function(item, win, recordNum, ownerGrid, taskId, position){
			item.addMember(
				isc.Button.create({
					title:"Withdraw<br>Owner Detail<br>Change",
					height:thickBtnHeight,
					click:function(){
						var formData = win.form.getData();
						formData.taskId = taskId;
						ownerDS.updateData(null, function() {
							win.markForDestroy();
							refreshInbox();
						}, {data:formData, operationId:"ownerDS_change_withdraw"});
					}
				}), position)};

var addBtnOwnerDetailReadyCrossCheckCoR = function(item, win, recordNum, ownerGrid, taskId, position) {
	item.addMember(
		isc.Button.create({
			title:"Ready to<br>Cross-Check<br>CoR",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(null, function() {
					win.markForDestroy();
					refreshInbox();
				}, {data:formData, operationId:"ownerDS_change_crosscheck"});
			}
		}), position)};
var addBtnOwnerDetailCompleteChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Complete <br>Change",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				getTransaction(function(tx) {
					formData.tx = tx;
					ownerDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"ownerDS_change_complete"});
				});
			}
		}), position)};

var addBtnOwnerDetailOwnershipReceiveChange = function(item, win, recordNum, ownerGrid, position){
	item.addMember(
		isc.Button.create({
			title:"Receive<br>Transfer/Transmit<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				ownerDS.updateData(win.form.getData(), function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_receive"});
			},
		}), position)};
var addBtnOwnershipReceiveChange = function(item, win, position){
	item.addMember(
		isc.Button.create({
			title:"Receive<br>Change<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_receive"});
			}
		}), position)};
var addBtnOwnershipAcceptChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Accept<br>Change<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_accept"});
			},
		}), position)};
var addBtnOwnershipApproveChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Approve<br>Change<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_approve"});
			},
		}), position)};
var addBtnOwnershipReadyCrossCheckCoR = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Ready to<br>Cross-Check CoR",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_ready"});
			},
		}), position)};
var addBtnOwnershipCompleteChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Complete<br>Change<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				getTransaction(function(tx) {
					formData.tx = tx;
					ownerDS.updateData(formData, function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_complete"});
				});
			},
		}), position)};
var addBtnOwnershipWithdrawChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Withdraw<br>Change<br>Ownership",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_withdraw"});
			},
		}), position)};

var openOwnerWindow = function(owner, ownerFormFields, ownerGrid, recordNum, form, mode, taskId) {
	var win = openEditor(ownerFormFields, {}, "", owner, (mode == 5) ? "Transfer/Transmit Ownership" : "Owner", ownerWinWidth, ownerWinHeight);
	var regStatus = form.getField("regStatus").getValue();
	if (owner.applNo!=null){
		win.items[0].getField("applNo").setValue(owner.applNo);
	}
	if (recordNum==-1){
		var data = ownerGrid.getData();
		if (data.length==0){
			win.items[0].getField("ownerSeqNo").setValue(1);
		} else {
			var rec = data[data.length-1];
			win.items[0].getField("ownerSeqNo").setValue(rec.ownerSeqNo+1);
		}
	}
	if (!form.task) {
		if ( regStatus==undefined || regStatus=="A" ){	// under application show only save button
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, 0, 0);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else if (regStatus=="R") { // already registered, show only amend button
			if (mode==5) {	// new transfer/transmit applicaiton
				addBtnOwnershipReceiveChange(win.items[1], win, 0);
				addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 1);
				addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 2);
				addBtnOwnerDetailClose(win.items[1], win, 3);
			} else {
				addBtnOwnerDetailReceiveChange(win.items[1], win, recordNum, ownerGrid, 0);
				addBtnOwnerDetailAmend(win.items[1], win, recordNum, ownerGrid, 1);
				addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 2);
				addBtnOwnerDetailClose(win.items[1], win, 3);
			}
		} else {
			addBtnOwnerDetailClose(win.items[1], win, 0);
		}
	} else if (mode==5) {
		if (form.task.name=="transferOwnerChange_received"){
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 0);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
//			addBtnOwnershipAcceptChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
//			addBtnOwnershipWithdrawChange(win.items[1], win, recordNum, ownerGrid, taskId, 1);
//			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else if (form.task.name=="transferOwnerChange_accepted"){
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 0);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
//			addBtnOwnershipApproveChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
//			addBtnOwnershipWithdrawChange(win.items[1], win, recordNum, ownerGrid, taskId, 1);
//			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else if (form.task.name=="transferOwnerChange_approved"){
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 0);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
//			addBtnOwnershipReadyCrossCheckCoR(win.items[1], win, recordNum, ownerGrid, taskId, 0);
//			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 1);
//			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 2);
//			addBtnOwnerDetailClose(win.items[1], win, 3);
		} else if (form.task.name=="transferOwnerChange_pendingCrossCheck"){
			//addBtnOwnershipCompleteChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
			addBtnOwnerDetailClose(win.items[1], win, 0);
		} else {
			addBtnOwnerDetailClose(win.items[1], win, 0);
		}
	} else if (mode==6) {	// when it is change application
		if (form.task.name == "ownerChange_received") {
			addBtnOwnerDetailAcceptChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
			addBtnOwnerDetailWithdrawChange(win.items[1], win, recordNum, ownerGrid, taskId, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else if (form.task.name == "ownerChange_accepted"){
			addBtnOwnerDetailApproveChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
			addBtnOwnerDetailWithdrawChange(win.items[1], win, recordNum, ownerGrid, taskId, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else if (form.task.name == "ownerChange_approved"){
			addBtnOwnerDetailReadyCrossCheckCoR(win.items[1], win, recordNum, ownerGrid, taskId, 0);
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 1);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 2);
			addBtnOwnerDetailClose(win.items[1], win, 3);
		} else if (form.task.name == "ownerChange_pendingCrossCheck"){
			addBtnOwnerDetailCompleteChange(win.items[1], win, recordNum, ownerGrid, taskId, 0);
			addBtnOwnerDetailClose(win.items[1], win, 1);
		}
	} else if (mode==0) {
		if (form.task.name=="newShipReg_received"
			|| form.task.name=="newShipReg_pendingAccept"
			|| form.task.name=="newShipReg_pendingDoc"
			|| form.task.name=="newShipReg_ready") {
			addBtnOwnerDetailSave(win.items[1], win, recordNum, ownerGrid, mode, 0);
			addBtnOwnerDetailCopyCompanySearch(win.items[1], win, 1);
			addBtnOwnerDetailClose(win.items[1], win, 2);
		} else {
			addBtnOwnerDetailClose(win.items[1], win, 0);
		}
	} else {
		addBtnOwnerDetailClose(win.items[1], win, 0);
	}

//			if (mode == 5) { // Transfer/Transmit ownership
//				var todo = form.todo? form.todo : [];
//				if (todo.contains("accept")) {
//					win.items[1].addMember(btnOwnershipAcceptChange, 0);
//				}
//				if (todo.contains("approve")) {
//					win.items[1].addMember(btnOwnershipApproveChange, 0);
//				}
//				if (todo.contains("readyCrossCheck")) {
//					win.items[1].addMember(btnOwnershipReadyCrossCheckCoR, 0);
//				}
//				if (todo.contains("complete")) {
//					win.items[1].addMember(btnOwnershipCompleteChange, 0);
//				}
//				if (todo.contains("withdraw")) {
//					win.items[1].addMember(btnOwnershipWithdrawChange, 0);
//				}
//			} else if (typeof owner.version != "undefined") {
//				if (!form.task) {
//					win.items[1].addMember(btnOwnerDetailReceiveChange, 0);
//					win.items[1].addMember(btnOwnershipReceiveChange, 0);
//				}
//				var todo = form.todo? form.todo : [];
//				if (todo.contains("withdrawOwnerChange")) {
//					win.items[1].addMember(btnOwnerDetailWithdrawChange, 0);
//				}
//				if (todo.contains("acceptOwnerChange")) {
//					win.items[1].addMember(btnOwnerDetailAcceptChange, 0);
//				}
//				if (todo.contains("readyCrossCheck")) {
//					win.items[1].addMember(btnOwnerDetailReadyCrossCheckCoR, 0);
//				}
//				if (todo.contains("approveOwnerChange")) {
//					win.items[1].addMember(btnOwnerDetailApproveChange, 0);
//				}
//				if (todo.contains("completeOwnerChange")) {
//					win.items[1].addMember(btnOwnerDetailCompleteChange, 0);
//				}
//			}

	return win;
};

var openMortgageWindow = function(owner, ownerFields, ownerGrid, recordNum, form, mode) {
};

var addBtnBuilderDetailClose = function(item, win, position){
	item.addMember(
		isc.Button.create({
			title:"Close Builder<br>Form",
			height:thickBtnHeight,
			click:function(){
					win.markForDestroy();
					refreshInbox();
			}
		}), position)};
var addBtnBuilderDetailSave = function(item, win, recordNum, builderGrid, position) {
	item.addMember(
			isc.Button.create(
				{title:"Save<br>Builder Detail",
					height:thickBtnHeight,
					click:function(){
//			openBuilder({"Update Builder":function(bdForm, bdWin){
//						if (bdForm.validate()) {
//							builderDS.addData(bdForm.getData(), function(resp,data,req) {
//								builderDS.fetchData({applNo:bdForm.getData().applNo}, function(resp,data,req) {
//									form.builderGrid.setData(data);
//									bdWin.markForDestroy()
//								});
//							});
//						}
//					}}, form.getData().applNo);
						if (win.form.validate()){
							var formData = win.form.getData();
							if (typeof formData.version!="undefined" && formData.applNo) {
								if (recordNum>=0){
									builderDS.updateData(formData, function(){
										builderDS.fetchData({applNo:formData.applNo},
												function(resp,data,req){
													builderGrid.setData(data);
													win.markForDestroy();
										})
									})
								}
//								} else {
//									builderDS.addData(formData, function(resp,data,req){
//										builderDS.fetchData({applNo:formData.getData().applNo},
//												function(resp,data,req){
//													builderGrid.setData(data);
//													win.markForDestroy();
//										})
//									})
//								}
							} else {
								builderDS.addData(formData, function(resp, data, req) {
									builderDS.fetchData({applNo:data.applNo},
											function(resp,data,req){
												builderGrid.setData(data);
												win.markForDestroy();
									})
								})
							}
						}
//						if (win.form.validate()) {
//							var formData = win.form.getData();
//							if (typeof formData.version != "undefined" && formData.applNo) {
//								getTransaction(function(tx) {
//									formData.tx = tx;
//									builderDS.updateData(null, function() {
//										builderDS.fetchData({applNo:formData.applNo},function(resp,data,req){
//											builderGrid.setData(data);
//											win.markForDestroy();
//											refreshInbox();
//										});
//									}, {data:formData});
//								});
//							} else if (recordNum >= 0) {
//								builderGrid.getData().removeAt(recordNum);
//								builderGrid.getData().addAt(formData, recordNum);
//								win.markForDestroy();
//								refreshInbox();
//							} else {
//								builderGrid.getData().add(formData);
//								win.markForDestroy();
//								refreshInbox();
//							}
//						}
					}
				}), position)};
var addBtnBuilderDetailAmend = function(item, win, recordNum, builderGrid, position) {
	item.addMember(
			isc.Button.create(
				{title:"Amend<br>Builder Detail",
					height:thickBtnHeight,
					click:function(){
						if (win.form.validate()) {
							var formData = win.form.getData();
							if (typeof formData.version != "undefined" && formData.applNo) {
								getTransaction(function(tx) {
									formData.tx = tx;
									builderDS.updateData(null, function() {
										builderDS.fetchData({applNo:formData.applNo},function(resp,data,req){
											builderGrid.setData(data);
											win.markForDestroy();
											refreshInbox();
										});
									}, {data:formData});
								});
							} else if (recordNum >= 0) {
								builderGrid.getData().removeAt(recordNum);
								builderGrid.getData().addAt(formData, recordNum);
								win.markForDestroy();
								refreshInbox();
							} else {
								builderGrid.getData().add(formData);
								win.markForDestroy();
								refreshInbox();
							}
						}
					}
				}), position)};
var addBtnBuilderDetailReceiveChange = function(item, win, recordNum, ownerGrid, position){
	item.addMember(
			isc.Button.create({
				title:"Receive<br>Builder Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
//					builderDS.fetchData({applNo:record.applNo}, function(resp,data,req){
//						form.builderGrid.setData(data);
//						bdWin.markForDestroy();
//						refreshInbox();
//					});
//				}, {operation:"builderDS_changeReceive", data:bdForm.getData()});
//					builderDS.updateData(win.form.getData(), function(resp,data,req){
					builderDS.updateData(win.form.getData(), function() {
						//form.builderGrid.setData(data);
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"builderDS_changeReceive"});
				},
			}), position)};
var addBtnBuilderDetailAcceptChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Accept<br>Builder Detail<br>Change",
			height:thickBtnHeight,
			click: function() {
				var formData = win.form.getData();
				formData.taskId = taskId;
				builderDS.updateData(null, function(){
					win.markForDestroy();
					refreshInbox();
				}, {data:formData, operationId:"bmAccept"});
			}
		}), position)};
var addBtnBuilderDetailApproveChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
			isc.Button.create({
				title:"Approve<br>Builder Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = taskId;
					builderDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"bmApprove"});
				}
			}), position)};
var addBtnBuilderDetailWithdrawChange = function(item, win, recordNum, ownerGrid, taskId, position){
				item.addMember(
						isc.Button.create({
							title:"Withdraw<br>Builder Detail<br>Change",
							height:thickBtnHeight,
							click:function(){
								var formData = win.form.getData();
								formData.taskId = taskId;
								builderDS.updateData(null, function() {
									win.markForDestroy();
									refreshInbox();
								}, {data:formData, operationId:"bmWithdraw"});
							}
						}), position)};
var addBtnBuilderDetailReadyCrossCheckCoR = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Ready to<br>Cross-Check<br>CoR",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				builderDS.updateData(null, function() {
					win.markForDestroy();
					refreshInbox();
				}, {data:formData, operationId:"bmReady"});
			}
		}), position)};
var addBtnBuilderDetailCompleteChange = function(item, win, recordNum, ownerGrid, taskId, position){
	item.addMember(
		isc.Button.create({
			title:"Complete <br>Change",
			height:thickBtnHeight,
			click:function(){
				var formData = win.form.getData();
				formData.taskId = taskId;
				getTransaction(function(tx) {
					formData.tx = tx;
					builderDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"bmComplete"});
				});
			}
		}), position)};

var openBuilderWindow = function(builder, builderFormFields, builderGrid, recordNum, form, mode, taskId) {
	var win = openEditor(builderFormFields, {}, "", builder, "Builder", builderWinWidth, builderWinHeight);
	var regStatus = form.getField("regStatus").getValue();
	console.log("builder applno" + builder.applNo);
	if (builder.applNo!=null){
		win.items[0].getField("applNo").setValue(builder.applNo);
	}
	if (!form.task){
		if ( regStatus==undefined || regStatus=="A" ){	// under application show only save button
			addBtnBuilderDetailSave(win.items[1], win, recordNum, builderGrid, 0);
			addBtnBuilderDetailClose(win.items[1], win, 1);
		} else if (regStatus=="R") { // already registered, show only amend button
			addBtnBuilderDetailReceiveChange(win.items[1], win, recordNum, builderGrid, 0);
			addBtnBuilderDetailAmend(win.items[1], win, recordNum, builderGrid, 1);
			addBtnBuilderDetailClose(win.items[1], win, 2);
		} else {
			addBtnBuilderDetailClose(win.items[1], win, 0);
		}
	} else if (mode==7) {
		if (form.task.name == "bmChange_received") {
			addBtnBuilderDetailAcceptChange(win.items[1], win, recordNum, builderGrid, taskId, 0);
			addBtnBuilderDetailWithdrawChange(win.items[1], win, recordNum, builderGrid, taskId, 1);
			addBtnBuilderDetailClose(win.items[1], win, 2);
		} else if (form.task.name == "bmChange_accepted") {
			addBtnBuilderDetailApproveChange(win.items[1], win, recordNum, builderGrid, taskId, 0);
			addBtnBuilderDetailWithdrawChange(win.items[1], win, recordNum, builderGrid, taskId, 1);
			addBtnBuilderDetailClose(win.items[1], win, 2);
		} else if (form.task.name == "bmChange_approved") {
			addBtnBuilderDetailReadyCrossCheckCoR(win.items[1], win, recordNum, builderGrid, taskId, 0);
			addBtnBuilderDetailSave(win.items[1], win, recordNum, builderGrid, 1);
			addBtnBuilderDetailClose(win.items[1], win, 2);
		} else if (form.task.name == "bmChange_pendingCrossCheck") {
			addBtnBuilderDetailCompleteChange(win.items[1], win, recordNum, builderGrid, taskId, 0);
			addBtnBuilderDetailClose(win.items[1], win, 1);
		}
	} else if (mode==0) {
		if (form.task.name=="newShipReg_received"
			|| form.task.name=="newShipReg_pendingAccept"
			|| form.task.name=="newShipReg_pendingDoc"
			|| form.task.name=="newShipReg_ready") {
			addBtnBuilderDetailSave(win.items[1], win, recordNum, builderGrid, 0);
			addBtnBuilderDetailClose(win.items[1], win, 1);
		} else {
			addBtnBuilderDetailClose(win.items[1], win, 0);
		}
	} else if (mode == 1 && regStatus == "A") {
		addBtnBuilderDetailSave(win.items[1], win, recordNum, builderGrid, 0);
		addBtnBuilderDetailClose(win.items[1], win, 1);
	} else {
		addBtnBuilderDetailClose(win.items[1], win, 0);
	}
};

var addBtnInjunctionDetailClose = function(item, win, position){
	item.addMember(
		isc.Button.create({
			title:"Close Injunction<br>Form",
			height:thickBtnHeight,
			click:function(){
					win.markForDestroy();
					refreshInbox();
			}
		}), position)};
var addBtnInjunctionDetailSave;
var addBtnInjunctionDetailAmend;

var openInjunctionWindow = function(injunction, injunctionFields, injunctionGrid, recordNum, form, mode) {
	var win = openEditor(injunctionFields, {}, "", injunction, "Injunction", injuctionWinWidth, injuctionWinHeight);
	var regStatus = form.getField("regStatus").getValue();
	//console.log("builder applno" + builder.applNo);
	if (injunction.applNo!=null){
		win.items[0].getField("applNo").setValue(injunction.applNo);
	}
	if (!form.task){
		if ( regStatus==undefined || regStatus=="A" ){	// under application show only save button
			addBtnInjunctionDetailSave(win.items[1], win, recordNum, injunctionGrid, 0);
			addBtnInjunctionDetailClose(win.items[1], win, 1);
		} else if (regStatus=="R") { // already registered, show only amend button
			addBtnInjunctionDetailReceiveChange(win.items[1], win, recordNum, injunctionGrid, 0);
			addBtnInjunctionDetailAmend(win.items[1], win, recordNum, injunctionGrid, 1);
			addBtnInjunctionDetailClose(win.items[1], win, 2);
		} else {
			addBtnInjunctionDetailClose(win.items[1], win, 0);
		}
	}
};

var openCopyCompanySearchForm = function(windowTitle, callback){
	var companySearchFormList = isc.ListGrid.create({
		ID:"companySearchFormList",
		dataSource:"companySearchDS",
		showFilterEditor:true,
		fields:[
			{ name:"companyName", title:"Company Name", width:"*" }
		],
	});
	var companySearchForm_BtnToolbar = isc.ButtonToolbar.create({
		ID: "copyCompanySearchForm_BtnToolbar",
		buttons:[
			{ name: "copy", title: "copy", width:50,
				click: function(){
					var record = companySearchFormList.getSelectedRecord();
					callback(record);
					companySearchWindow.close();
				}
			},
			{ name: "close", title:"Close", width:50,
				click: function(){
					companySearchWindow.close();
				}
			}
		]
	});
	var companySearchWindow = isc.Window.create({
		ID: "companySearchWindow",
		title: windowTitle,
		width: 400,
		height:200,
		isModal: true,
		items:[
			isc.VLayout.create({
				members:[
					companySearchFormList,
					companySearchForm_BtnToolbar
				]
			})
		]
	});
	companySearchWindow.show();
	companySearchFormList.fetchData({}, function(){});
	return companySearchWindow;
};

var copyVer = function(src, target) {
	if (src) {
		target.createdBy = src.createdBy;
		target.createdDate = src.createdDate;
		target.updatedDate = src.updatedDate;
		target.updatedBy = src.updatedBy;
		target.version = src.version;
	}
};
var openEditor = function(fields, actions, applNo, record, title, width, height){
	console.log("open editor");
	var form = isc.DynamicForm.create( { colWidths:[120, width - 140],  fields:fields } );
	form.getFields().forEach(function(f) { if (f.name == "applNo") f.setValue(applNo); });
	var buttons = isc.HLayout.create({
		align:"right",
		//members:[isc.Button.create({title:"test"})]
	});
	for (var name in actions) {
		buttons.addMember(isc.Button.create({
			title:name,
			height:thickBtnHeight,
			click:function(){
				actions[this.getTitle()](form, form.parentElement.parentElement);
			}
		}));
	};
//	if (title=="Owner"){
//		buttons.addMember(isc.Button.create({
//			title:"Copy from <br>Company Search",
//			height:thickBtnHeight,
//			click:function(){
//				console.log("copy company search");
//				openCopyCompanySearchForm("Copy Company Search", function(record){
//					form.getField("name").setValue(record.companyName);
//					form.getField("address1").setValue("");
//					form.getField("address2").setValue("");
//					form.getField("address3").setValue("");
//					if (record.registeredOffice.length<=80){
//						form.getField("address1").setValue(record.registeredOffice);
//					} else if (record.registeredOffice.length<=160){
//						form.getField("address1").setValue(record.registeredOffice.substring(0,79));
//						form.getField("address2").setValue(record.registeredOffice.substring(80,record.registeredOffice.length-1));
//					} else {
//						form.getField("address1").setValue(record.registeredOffice.substring(0,79));
//						form.getField("address2").setValue(record.registeredOffice.substring(80,159));
//						if ( record.registeredOffice.length<=240) {
//							form.getField("address3").setValue(record.registedOffice.substring(160, record.registeredOffice.length-1));
//						} else {
//							form.getField("address3").setValue(record.registeredOffice.substring(160,239));
//						}
//					}
//				})
//			}
//		}));
//	}
//	buttons.addMember(isc.Button.create({
//		title:"Close",
//		height:thickBtnHeight,
//		click:function(){
//			win.markForDestroy();
//			refreshInbox();
//		}
//	}));

//	var buttons = isc.HLayout.create({ align:"right", members:
//		[isc.Button.create({title:"Close", height:50, click:function(){ win.markForDestroy();
//	refreshInbox();},})]});
//	for (var name in actions) {
//		buttons.addMember(isc.Button.create({
//			title:name,
//			height:50,
//			click:function(){
//				actions[this.getTitle()](form, form.parentElement.parentElement);
//			}
//		}));
//	}
	if (record) {
		form.setData(record);
		form.getFields().forEach(function(f) { if (f.unmodifiable) f.disable(); });
	}
	var win = isc.Window.create({ title:title, width:width, height:height, items:[form,buttons]});
	win.form = form;
	win.show();
	return win;
};
var openEditor2 = function(fields, btns, applNo, record, title, width, height) {
	console.log("open editor2");
	var form = isc.DynamicForm.create( { colWidths:[120, width - 140],  fields:fields } );
	form.getFields().forEach(function(f) { if (f.name == "applNo") f.setValue(applNo); });
//		var buttons = [];
//		btns.forEach(function(i) {
//			//if (i.showIf == undefined || i.showIf()) {
//			//	buttons.add(isc.Button.create(i));
//			//}
//			buttons.add(i);
//		});
	if (record) {
		form.setData(record);
		form.getFields().forEach(function(f) { if (f.unmodifiable) f.disable(); });
	}
	var editor2_btns = isc.ButtonToolbar.create({
		//ID:"editor2Detail_Toolbar",
		height: thickBtnHeight,
		buttons: [
//			isc.Button.create({title:"abc"}),
//			btns[0]
		],
	});
	btns.forEach(function(i){
		editor2_btns.addMember(i);
	});
	var win = isc.Window.create({ title:title, width:width, height:height,
		//items:[form,btns]
		items:[
			isc.WindowVLayout.create({
				members:[
					form,
					editor2_btns
				]
			})
		]
	});
	win.form = form;
	win.show();
	return win;
};

var openBuilder = function(actions, applNo, record) {
	return openEditor([
					{name:"applNo",title:"Appl No.",type:"staticText", value:applNo},
					{name:"builderCode",title:"Code", required:true, unmodifiable:true, length:1, defaultValue:"S", hidden:true},
					{name:"name",title:"Name", required:true, unmodifiable:true, width:400 , characterCasing: "upper"},
					{name:"address1",title:"Addr", required:true, width:400, length:40, characterCasing: "upper"},
					{name:"address2",title:"", width:400, length:40, characterCasing: "upper"},
					{name:"address3",title:"", width:400, length:40, characterCasing: "upper"},
					{name:"email",title:"Email", width:200},
					{name:"major",title:"Major", length:1, valueMap:["Y","N"], defaultValue:"Y", required:true},
					], actions, applNo, record, "Builder", builderWinWidth, builderWinHeight);
};

var openBuilder2 = function(btns, applNo, record) {
	return openEditor2([
					{name:"applNo",title:"Appl No.",type:"staticText", value:applNo},
					{name:"builderCode",title:"Code", required:true, unmodifiable:true, length:1, defaultValue:"S", hidden:true},
					{name:"name",title:"Name", required:true, unmodifiable:true, width:400 , characterCasing: "upper"},
					{name:"address1",title:"Addr", required:true, width:400, length:40, characterCasing: "upper"},
					{name:"address2",title:"", width:400, length:40, characterCasing: "upper"},
					{name:"address3",title:"", width:400, length:40, characterCasing: "upper"},
					{name:"email",title:"Email", width:200},
					{name:"major",title:"Major", length:1, valueMap:["Y","N"], defaultValue:"Y", required:true},
					], btns, applNo, record, "Builder", builderWinWidth, builderWinHeight);
};

var openInjuction = function(actions, applNo, record) {
	var win = openEditor([
					{name:"applNo",title:"Appl No.",type:"staticText", value:applNo},
					{name:"injuctionCode",title:"Code", required:true, unmodifiable:true},
					{name:"injuctionDesc",title:"Description", required:true, width:200},
					{name:"expiryDate",title:"Expiry Date", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy"},
					], actions, applNo, record, "Injunction", injuctionWinWidth, injuctionWinHeight);
	return win;
};


var openRegMaster = function(record, task, mode
		/* 0 normal, 1 reReg, 2 deReg, 3 change details,
		 * 4 rp Change, 5 transfer/transmit ownership
		 * */, openProp){

	// Ship Reg Applicaiton buttons
	var btnSrCloseForm = isc.Button.create(
			{title:"Close<br>ShipReg<br>Form", height:thickBtnHeight,
				click:function(){ win.markForDestroy(); refreshInbox();},});
	var btnSrCheckShipName = isc.Button.create(
			{ ID: btnSrCheckShipName,
				title:"Check<br>Ship Name",
				  height:thickBtnHeight,
				  //disabled = false,
				  click:function(){
					  if (form.validate()) {
						  var data = form.getData();
						  data.taskId = taskId;
						  data.owners = form.ownerGrid.getData();
						  var ownerNames = [];
						  data.owners.forEach(function (owner) { if (owner.name) ownerNames.add(owner.name);} );
						  regMasterDS.fetchData(data, function(resp, data, req) {
							  var checkResultFailed = false;
							  var showMessages = function(itemKey, message){
								  if (message) {
									  var v = {action:function(){},condition:"return false",defaultErrorMessage:message,requireServer:false,type:"checkNames"}
									  form.getItem(itemKey).validators.add(v);
									  form.getItem(itemKey).validate();
									  form.getItem(itemKey).validators.remove(v);
									  checkResultFailed = true;
								  } else {
									  form.getItem(itemKey).validate();
								  }
							  };
							  showMessages("regName", data.regName);
							  showMessages("regChiName", data.regChiName);
							  showMessages("imoNo", data.imoNo);
							  form.getField(btnSrCheckShipName).setDisabled(!checkResultFailed);
						  }, {operationId:"RegMasterDS_fetchData_checkNames", data:data});
					  }
			     }
			});
	var btnSrAssignCallSign = isc.Button.create({
		ID:btnSrAssignCallSign,
		title:"Assign<br>Call Sign",
		height:thickBtnHeight,
		click:function(){
			regMasterDS.fetchData(null, function(resp, data, req) {
				form.getItem("callSign").setValue(data.callSign);
				form.getField(btnSrAssignCallSign).setDisabled(true);
			}, {operationId:"RegMasterDS_fetchData_callSign"});
		},});
	var btnSrAssignOfficialNumber = isc.Button.create({
		ID:btnSrAssignOfficialNumber,
		title:"Assign<br>Offical No.",
		height:thickBtnHeight,
		click:function(){
			regMasterDS.fetchData(null, function(resp, data, req) {
				form.getItem("offNo").setValue(data.offNo);
				form.getField(btnSrAssignOfficialNumber).setDisabled(true);
			}, {operationId:"RegMasterDS_fetchData_offNo"});
		},});
	var btnSrReceiveApplication = isc.Button.create(
			{ title:"Receive<br>ShipReg<br>Application",
				height:thickBtnHeight,
				click:function(){ proceedTask("RegMasterDS_updateData_new"); }
			});
	var btnSrRequestAcceptApplication = isc.Button.create(
			{ title:"Request Accept<br>ShipReg<br>Application",
				height:thickBtnHeight,
				click:function(){ proceedTask("RegMasterDS_updateData_requestAccept"); },
			});
	var btnSrWithdrawApplication = isc.Button.create({title:"Withdraw<br>ShipReg<br>Application", height:thickBtnHeight,
		click:function(){ proceedTask("RegMasterDS_updateData_withdraw"); },});
	var btnSrRejectApplication = isc.Button.create({title:"Reject<br>ShipReg<br>Application", height:thickBtnHeight,
		click:function(){ proceedTask("RegMasterDS_updateData_reject"); },});
	var btnSrAcceptApplication = isc.Button.create({title:"Accept<br>ShipReg<br>Application", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_accept"); },});
	var btnSrResetApplication = isc.Button.create({title:"Reset<br>ShipReg<br>Application", height:thickBtnHeight,
		click:function(){ proceedTask("RegMasterDS_updateData_reset"); },});
	var btnSrReadyApprovalApplication = isc.Button.create({title:"Ready Approval<br>ShipReg<br>Application", height:thickBtnHeight,
		click:function(){ proceedTask("RegMasterDS_updateData_approveReady"); },});
	var btnSrApproveApplication = isc.Button.create({title:"Approve<br>ShipReg<br>Application", height:thickBtnHeight,
		click:function(){ proceedTask("RegMasterDS_updateData_approve"); },});
	var refreshRegMasterAfterCompleteChange = function(){
		regMasterDS.fetchData({applNo:record.applNo}, function(resp, data, req) {
			form.setData(data);
		});
	}
	var btnSrCompleteApplication = isc.Button.create({
		ID:btnSrCompleteApplication,
		title:"ShipReg<br>Application<br>Complete",
		height:thickBtnHeight,
		click:function(){
			getTransaction( function(tx){
				proceedTask("RegMasterDS_updateData_complete", null, tx, refreshRegMasterAfterCompleteChange);
			}, {details:"REGISTRATION ", changeDate:form.getField("regTime").getValue()});
			//form.getField(btnSrCompleteApplication).setDisabled(true);
		}
	});
	var btnSrAcceptChange = isc.Button.create({title:"Accept<br>Registration<br>Change", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_accept_changeDetails", mode); },});
	var btnSrApproveChange = isc.Button.create({title:"Approve<br>Registration<br>Change", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_approve_changeDetails", mode); },});
	var btnSrProToFull = isc.Button.create({
		title:"Pro-Reg to<br>Full-Reg",
		height:thickBtnHeight,
		click:function(){
			form.getField("applNoSuf").setValue("F");
			form.getField("provRegDate").setValue(form.getField("regDate").getValue());
			form.getField("regDate").setValue(null);
			form.getField("regDate").setDisabled(false);
			form.getField("regDate").setRequired(true);
			form.getField("regTime").setValue(null);
			form.getField("regTime").setDisabled(false);
			form.getField("regTime").setRequired(true);
			
			form.getField(btnSrProToFull).setDisabled(true);
		}
	});
	var btnSrReadyCrossCheckCoR = isc.Button.create({title:"Cross Check<br>CoR Ready", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_crossCheckReady_changeDetails", mode); },});
	var btnSrCompleteChange = isc.Button.create({title:"Complete<br>Registration<br>Change", height:thickBtnHeight, click:function(){ getTransaction(function(tx) { proceedTask("RegMasterDS_updateData_complete_changeDetails", mode, tx); } ) } });
	var btnSrWithdrawChange = isc.Button.create({title:"Withdraw<br>Registration<br>Change", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_withdraw_changeDetails", mode); },});
	var btnSrAcceptDeReReg = isc.Button.create({
		title: mode==1 ? "Accept<br>Re-Reg" : "Accept<br>De-Reg",
		height:thickBtnHeight,
		click:function(){
			proceedTask("RegMasterDS_updateData_accept_reregdereg", mode);
		},
	});
	var btnSrApproveDeReReg = isc.Button.create({
		title: mode==1 ? "Approve<br>Re-Reg" : "Approve<br>De-Reg",
		height:thickBtnHeight,
		click:function(){
			proceedTask("RegMasterDS_updateData_approve_reregdereg", mode);
		},
	});
	var btnSrReadyCrossCheckCoRDeReReg = isc.Button.create({
		title:mode == 1 ? "De-Reg Re-Reg<br>CoD is Ready" : "CoD is Ready",
		height:thickBtnHeight,
		click:function(){
			//check "de-reg reason" is not null, "de-reg time" is not null
			if (form.getField("rcReasonCode").getValue()) {
				if (form.getField("deRegTime").getValue()) {
					proceedTask("RegMasterDS_updateData_crossCheckReady_reregdereg", mode);
				} else {
					isc.say("De Reg Time cannot be blank");
				}
			} else {
				isc.say("De Reg Reason cannot be blank");
			}
		},
	});
	var btnSrCompleteDeReReg = isc.Button.create({
		title: mode==1 ? "Complete<br>De-Reg of<br>Re-Reg" : "Complete<br>De-Reg",
		height:thickBtnHeight,
		click:function(){
			getTransaction(function(tx) {
				proceedTask("RegMasterDS_updateData_complete_reregdereg", mode, tx);
			})
		}
	});
	var btnSrCompleteReRegNewApp = isc.Button.create({
		title: "Complete<br>Re-Reg New<br>Application",
		height:thickBtnHeight,
		click:function(){
			getTransaction(function(tx) {
				if (form.getField("regTime").getValue() && form.getField("regDate").getValue()) {
					proceedTask("RegMasterDS_updateData_complete_reregnewapp", mode, tx);
				} else {
					isc.say("Reg Date and Reg Time cannot be blank");
				}
			})
		}
	});
	var btnSrWithdrawDeReReg = isc.Button.create({
		title: mode==1 ? "Withdraw<br>Re-Reg" : "Withdraw<br>De-Reg",
		height:thickBtnHeight,
		click:function(){
			proceedTask("RegMasterDS_updateData_withdraw_reregdereg", mode);
		},
	});

	// CoR buttons
	var btnSrCoRIsReady = isc.Button.create({title:"CoR is Ready", height:thickBtnHeight,
		click:function(){proceedTask("RegMasterDS_updateData_corReady"); },});
	var btnSrPreviewCoR = isc.IButton.create(
			{ title:"Preview CoR for<br>Cross Check",
				height:thickBtnHeight,
				click: function(){
					if (typeof record.applNo == "undefined" || record.applNo == null || record.applNo.trim() == "") return;
					if (form.getField("regDate").getValue()==null){
						isc.say('Reg Date is mandatory');
						return;
					} else {
						if (form.validate()) {
							var formData = form.getData()
							regMasterDS.updateData(formData, function(resp,rm,req) {
								form.setData(rm);
									ReportViewWindow.displayReport(
											["CoR",
												{applNo:record.applNo,
												reportDate:new Date(),
												registrar:record.registrar, // Long
												crosscheck:true,
												}
											]);
							});
						}
					}
//					ReportViewWindow.displayReport(
//						["CoR",
//							{applNo:record.applNo,
//							reportDate:new Date(),
//							registrar:record.registrar, // Long
//							crosscheck:true,
//							}
//						]);
			}
		});
	var readyToPrintCoR = function(){
			return record.regStatus=="R";
		};
		console.log("print");
		
	var btnSrPrintCoR = isc.IButton.create({
		title:"Print Cert",
		height:thickBtnHeight,
		//showDisabled: !readyToPrintCoR(),
		//disabled:true,
		

		click: function(){
			
			var backup = form.getData();
			if (form.getField("corCollect").getValue() == "RD") {
				var dataSource = "";
				
				if(form.getField("applNo").getValue() == "2019/438"){
					//dataSource = "showDNDetailDS";
					dataSource = "demandNoteHeaderDS";
					}else{
						//dataSource = "showDNDetailDS2";
						dataSource = "demandNoteHeaderDS";
					}
			
				

				//but004.setDisabled(true);
				var vlayout2 = isc.VLayout.create({members:[showDNDetailItemListGrid,but004 ]});
				
				//showDNDetailItemListGrid.getItem("but004").disable();

				isc.Window.create({
					title:"Cert Demandnote Status",
					width: 400,
					height: 310,
					items:[vlayout2]
				}).show();
				if(showDNDetailItemListGrid.getField("paymentStatusStr").getValue() != "Paid(Full)"){
				but004.setDisabled(true);
				}
				finDNDetailDynamicForm.setValues({});
				finDNDetailItemListGrid.setData([]);
				finDNDetailReceiptListGrid.setData([]);
				finDNDetailRefundListGrid.setData([]);
				finDNDetailDynamicForm.reset();
				var demandNoteNo = "051700000841194";
				showDNDetailItemListGrid.refresh(demandNoteNo);
			
			}else{
		
			if (typeof record.applNo == "undefined" || record.applNo == null || record.applNo.trim() == "") return;
			var report = (record && record.regStatus == "D") ? "CertOfD" : "CoR";
			var print = function() {
				isc.ask("Payment Required?", function(value){
					ReportViewWindow.displayReport(
						[report,
						 {applNo:record.applNo,
							reportDate:new Date(),
							registrar:record.registrar, // Long
							certified:false,
							paymentRequired:value,
							reason:"",
							printMortgage:true,
							zip:false,}]);
				});
			};
			if (record && record.regStatus == "D") {
				print();
			} else {
				// track code update
				regMasterDS.updateData(null, function(resp, data, req) {
					form.setData(data);
					print();
				}, {data:record, operationId:"updateTrackCode"});
			}}
		}});
	
	isc.DynamicForm.create({
		ID : "showDNDetailItemListGrid",
			dataSource : "demandNoteHeaderDS",
			
		fields: [
			{name:"demandNoteNo", title:"Demand Note No.", type:"staticText", colSpan:3},
			{name:"applNo", title:"Appl No.", required:true, colSpan:3, type:"staticText"},
			{name:"offNo", title:"Official No.", type:"staticText", colSpan:3, required:true},
			{name:"shipName", title:"Ship Name", type:"staticText", colSpan:3},
			{name:"billName", title:"Billing Person", required:true, colSpan:3, width:300, type:"staticText"},
			{name:"coName", title:"C/O", colSpan:3, width:350, type:"staticText"},
			{name:"address1", title:"Address", width:300, colSpan:3, type:"staticText"},
			{name:"address2", title:"", width:300, colSpan:3, type:"staticText"},
			{name:"address3", title:"", width:300, colSpan:3, type:"staticText"},
			{name:"generationTime", title:"Issue Date",  type:"staticText"},
			{name:"dueDate", title:"Due Date", type:"date", type:"staticText"},
			{name:"paymentStatusStr", title:"Payment Status", type:"staticText"},
			//{name:"ebsFlag", title:"EBS Flag", type:"boolean"},
			{name:"amount", title:"Total", type:"staticText"},
			
			
	         ],
	         refresh:function(demandNoteNo){
	        	 showDNDetailItemListGrid.fetchData({"demandNoteNo":demandNoteNo},
	   					function (dsResponse, data, dsRequest) {
	   			  
	   			  console.log(data);
	   				finDNDetailWindow.setTitle("Demand Note Detail (No: " + demandNoteNo + " )");


	   				finDNDetailItemListGrid.fetchData({"dnDemandNoteNo":demandNoteNo});
	   				finDNDetailReceiptListGrid.fetchData({"demandNoteNo":demandNoteNo},
	   											function (dsResponse, data, dsRequest){
	   						if(data.length>0){
	   							//only has receipts
	   							finDNDetailRefundListGrid.fetchData({"demandNoteNo":demandNoteNo},
	   									function (dsResponse, data, dsRequest){
	   										if(data.length==0){
	   											finDNDetailSectionForm_ToolBar.getButton('refundBtn').setDisabled(false);
	   										}
	   									}
	   							);

	   						}

	   					}, {"operationId":"FIND_VALUE_RECEIPT_BY_NO"}
	   				);
	   			},{'operationId':'FIND_DEMAND_NOTE_BY_NO'});
	   	  }
	});
	isc.IButton.create({
		ID:"but004",
		title:"Print Cert",
		click:function(){
			var date = new Date();
        	if (true) {
        		var print = function(date) {
        			var report = "CoR";
        			isc.ask("Payment Required?", function(value){
        				ReportViewWindow.displayReport([
						 
        							report,
        							 {applNo:backup.applNo,
        								reportDate:new Date(),
        								registrar:backup.registrar, // Long
        								certified:false,
        								paymentRequired:value,
        								reason:"",
        								printMortgage:true,
        								zip:false,}]);
        			});
        		};

        		if (record && record.regStatus == "D") {
    				print();
    			} else {
    				// track code update
    				regMasterDS.updateData(null, function(resp, data, req) {
    					form.setData(data);
    					print();
    				}, {data:record, operationId:"updateTrackCode"});
        	}}
        
			
		},
		//enable:false,
		//disabled:true,

	});
	var btnSrPreviewCoD = isc.IButton.create(
			{ title:"Preview CoD<br>for<br>Cross Check",
				height:thickBtnHeight,
				click: function(){
					if (typeof record.applNo == "undefined" || record.applNo == null || record.applNo.trim() == "") return;
					if (form.getField("deRegTime").getValue()==null){
						isc.say('De-Reg Date Time is mandatory');
						return;
					} else if (form.getField("rcReasonCode").getValue()==null){
						isc.say('De-Reg reason is mandatory');
						return;
					} else {
						if (form.validate()) {
							var formData = form.getData()
							regMasterDS.updateData(null, function(resp,rm,req) {
								form.setData(rm);
									ReportViewWindow.displayReport(
											["CertOfD",
												{applNo:record.applNo,
												reportDate:new Date(),
												registrar:record.registrar, // Long
												crosscheck:true,
												}
											]);
							}, {operationId:"previewCoD", data:formData});
						}
					}
//					var report = (record && record.regStatus == "D") ? "CertOfD" : "CoR";
//					var print = function() {
//						isc.ask("Payment Required?", function(value){
//							ReportViewWindow.displayReport(
//									[report,
//										{applNo:record.applNo,
//										reportDate:new Date(),
//										registrar:record.registrar, // Long
//										certified:false,
//										paymentRequired:value,
//										reason:"",
//										printMortgage:true,
//										zip:false,}]);
//						});
//					};
//					if (record && record.regStatus == "D") {
//						print();
//					}
				}});
	var btnSrPrintCoD = isc.IButton.create({ title:"Print CoD", height:thickBtnHeight, click: function(){
		if (typeof record.applNo == "undefined" || record.applNo == null || record.applNo.trim() == "") return;
		var report = (record && record.regStatus == "D") ? "CertOfD" : "CoR";
		var print = function() {
			isc.ask("Payment Required?", function(value){
				ReportViewWindow.displayReport(
						[report,
						 {applNo:record.applNo,
							reportDate:new Date(),
							registrar:record.registrar, // Long
							certified:false,
							paymentRequired:value,
							reason:"",
							printMortgage:true,
							zip:false,}]);
			});
		};
		if (record && record.regStatus == "D") {
			print();
		}
//		else {
//			// track code update
//			regMasterDS.updateData(null, function(resp, data, req) {
//				form.setData(data);
//				print();
//			}, {data:record, operationId:"updateTrackCode"});
//		}
	}});
	var btnSrPrint4CoR = isc.IButton.create({
		title:"Print 4 sets<br>of certificate",
		height:thickBtnHeight,
		click: function(){
//			if (form.getField("regStatus").getValue() == "A") {
//				isc.say("Please complete this ship's registration by clicking 'ShipReg Application Complete' button before printing CoR");
//				return;
//			}
			if (typeof record.applNo == "undefined" || record.applNo == null || record.applNo.trim() == "") return;
			var dateForm = isc.DynamicForm.create({
				fields:[
			        {name:"date1", title:"Date 1", type:"date", dateFormatter:"dd/MM/yyyy", required:true},
			        {name:"date2", title:"Date 2", type:"date", dateFormatter:"dd/MM/yyyy"},
			        {name:"date3", title:"Date 3", type:"date", dateFormatter:"dd/MM/yyyy"},
			        {name:"date4", title:"Date 4", type:"date", dateFormatter:"dd/MM/yyyy"},
			        {title:"Print", type:"button", click:function(){
			        	if (this.form.validate()) {
			        		var print = function(date) {
			        			var report = "CoR";
			        			isc.ask("Payment Required?", function(value){
			        				ReportViewWindow.displayReport(
			        						[report,
			        						 {applNo:record.applNo,
			        							reportDate:date,
			        							registrar:record.registrar, // Long
			        							certified:false,
			        							paymentRequired:value,
			        							reason:"",
			        							printMortgage:true,
			        							zip:false}]);
			        			});
			        		};

			        		// track code update
			        		regMasterDS.updateData(null, function(resp, data, req) {
			        			form.setData(data);
			        			print(dateForm.getData().date1);
			        			if (dateForm.getData().date2) print(dateForm.getData().date2);
			        			if (dateForm.getData().date3) print(dateForm.getData().date3);
			        			if (dateForm.getData().date4) print(dateForm.getData().date4);
			        		}, {data:record, operationId:"updateTrackCode"});
			        	}
			        }},
			    ]
		});
		isc.Window.create({
			title:"Print Certificates",
			width: 400,
			height: 180,
			items:[dateForm]
		}).show();
	}});

	// RP buttons
	var btnRpAmend = isc.Button.create({
		 title:"Amend RP<br>Detail",
		 height:thickBtnHeight,
		 click:function(){
			if (form.validate()) {
				var formData = form.getData()["representative"];
				formData.applNo = form.getField("applNo").getValue();
				copyVer(form.representative, formData);
				repDS.updateData(formData, function(resp,data,req) { setRep(data); });
			}
		 }
	});
	var btnRpSave = isc.Button.create({
		 title:"Save RP<br>Detail",
		 height:thickBtnHeight,
		 click:function(){
			if (form.validate()) {
				var formData = form.getData()["representative"];
				formData.applNo = form.getField("applNo").getValue();
				copyVer(form.representative, formData);
				repDS.updateData(formData, function(resp,data,req) { setRep(data); });
			}
		 }
	});
	var btnRpCopyFromCompanySearch = isc.Button.create({
		title:"Copy from <br>Company Search",
		height:thickBtnHeight,
		click:function(){
			console.log("copy company search");
			openCopyCompanySearchForm("Copy Company Search", function(record){
				form.getField("representative.name").setValue(record.companyName);
				form.getField("representative.address1").setValue("");
				form.getField("representative.address2").setValue("");
				form.getField("representative.address3").setValue("");
				if (record.registeredOffice.length<=80){
					form.getField("representative.address1").setValue(record.registeredOffice);
				} else if (record.registeredOffice.length<=160){
					form.getField("representative.address1").setValue(record.registeredOffice.substring(0,79));
					form.getField("representative.address2").setValue(record.registeredOffice.substring(80,record.registeredOffice.length-1));
				} else {
					form.getField("representative.address1").setValue(record.registeredOffice.substring(0,79));
					form.getField("representative.address2").setValue(record.registeredOffice.substring(80,159));
					if ( record.registeredOffice.length<=240) {
						form.getField("representative.address3").setValue(record.registedOffice.substring(160, record.registeredOffice.length-1));
					} else {
						form.getField("representative.address3").setValue(record.registeredOffice.substring(160,239));
					}
				}
			})
		}
	});
	var btnRpReceiveChangeApplication = isc.Button.create({
		title:"Receive<br>Change RP<br>Application",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			repDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"repDS_change_receive"});
		}
	});
	var btnRpAcceptChangeApplication = isc.Button.create({
		title:"Accept<br>Change RP<br>Application",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			repDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"repDS_change_accept"});
		}
	});
	var btnRpApproveChangeApplication = isc.Button.create({
		title:"Approve<br>Change RP<br>Application",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			repDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"repDS_change_approve"});
		}
	});
	var btnRpReadyCrossCheckCoR = isc.Button.create({
		title:"CoR<br>Cross Check<br>Ready",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			repDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"repDS_change_crosscheck"});
		}
	});
	var btnRpCompleteChange = isc.Button.create({
		title:"Complete<br>Change RP<br>Application",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			getTransaction(function(tx) {
				formData.tx = tx;
				repDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"repDS_change_complete"});
			});
		}
	});
	var btnRpWithdrawChange = isc.Button.create({
		title:"Withdraw<br>Change RP<br>Application",
		height:thickBtnHeight,
		click:function(){
			var formData = form.getData()["representative"];
			formData.applNo = form.getField("applNo").getValue();
			formData.taskId = form.taskId;
			repDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"repDS_change_withdraw"});
		}
	});

	// owner list buttons
	var btnOwnerListCopyToRP = isc.Button.create(
			{title:"Copy to <br>Representative",
				height: thickBtnHeight,
				click:function(){
					if (form.ownerGrid.getSelection().length == 1) {
						var owner = form.ownerGrid.getSelection()[0];
						form.getItem("representative.name").setValue(owner.name);
						form.getItem("representative.status").setValue(owner.status);
						form.getItem("representative.address1").setValue(owner.address1);
						form.getItem("representative.address2").setValue(owner.address2);
						form.getItem("representative.address3").setValue(owner.address3);
						form.getItem("representative.telNo").setValue("");
						form.getItem("representative.faxNo").setValue("");
						form.getItem("representative.email").setValue(owner.email);
						if (owner.overseaCert != null) {
							form.getItem("representative.incorpCert").setValue(owner.overseaCert);
						} else if (owner.incortCert != null) {
							form.getItem("representative.incorpCert").setValue(owner.incortCert);
						}
					}
				}
			});
	var btnOwnerListAddOwner = isc.Button.create(
	          {title:"Add Owner",
	        	  height: thickBtnHeight,
	        	  click:function() {
	        		  openOwnerWindow({type:"C", applNo:form.getData().applNo},
	        				  ownerFormFields, form.ownerGrid, -1, form, mode);
	        	  }
	          });
	var btnOwnerListRemoveOwner = isc.Button.create(
			  {title:"Remove Owner",
				  height: thickBtnHeight,
				  click:function() {
					  form.ownerGrid.removeSelectedData();
				  }
			  });
	var btnOwnerListSave = isc.Button.create(
			  { title:"Save",
				  height: thickBtnHeight,
				  click:function() {
					if (form.getField("applNo").getValue()) {
						form.ownerGrid.getData().forEach(function(owner) {
							owner.applNo = form.getField("applNo").getValue();
						});
						ownerDS.updateData({},
							function(resp,data,req) {
								form.ownerGrid.setData(data);
							}, {operationId:"ownerDS_updateData_owners",data:{owners:form.ownerGrid.getData().toArray()}});
					}
	        	 }
			  });
	var btnOwnerListNewOwnershipApplication = isc.Button.create({
		title:"New<br>Transfer/Transmit<br>Ownership",
		height:thickBtnHeight,
		click:function(){
  		  openOwnerWindow({type:"C", applNo:form.getData().applNo},
				  ownerFormFields, form.ownerGrid, -1, form, 5);
		}
	});
	var btnOwnerListReceiveTransferTransmit = isc.Button.create({
		title:"Receive<br>Transfer/Transmit<br>Ownership",
		height: thickBtnHeight,
		click:function(){
				ownerDS.updateData(form.getData(), function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_receive"});
		}
	});
	var btnOwnerListAcceptTransferTransmit = isc.Button.create({
		title:"Accept<br>Change<br>Ownership",
		height: thickBtnHeight,
		click:function(){
			var formData = form.getData();
			formData.taskId = form.taskId;
			ownerDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"ownerDS_Tran_accept"});
		}
	});
	var btnOwnerListApproveTransferTransmit = isc.Button.create({
		title:"Approve<br>Change<br>Ownership",
		height: thickBtnHeight,
		click:function(){
			var formData = form.getData();
			formData.taskId = form.taskId;
			ownerDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"ownerDS_Tran_approve"});
		}
	});
	var btnOwnerListCrossCheckCoRTransferTransmit = isc.Button.create({
		title:"Ready to<br>Cross-Check<br>CoR",
		height: thickBtnHeight,
		click:function(){
			var formData = form.getData();
			formData.taskId = form.taskId;
			ownerDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"ownerDS_Tran_ready"});
		}
	});
	var btnOwnerListCompleteTransferTransmit = isc.Button.create({
		title:"Complete<br>Change<br>Ownership",
		height: thickBtnHeight,
		click:function(){
			var formData = form.getData();
			formData.taskId = form.taskId;
			getTransaction(function(tx) {
				formData.tx = tx;
				ownerDS.updateData(formData, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"ownerDS_Tran_complete"});
			});
		}
	});
	var btnOwnerListWithdrawTransferTransmit = isc.Button.create({
		title:"Withdraw<br>Change<br>Ownership",
		height: thickBtnHeight,
		click:function(){
			var formData = form.getData();
			formData.taskId = form.taskId;
			ownerDS.updateData(formData, function(){
				win.markForDestroy();
				refreshInbox();
			}, {operationId:"ownerDS_Tran_withdraw"});
		}
	});

//	 mailButton("Email to <br>Collect CoR", "Email sent to owner", "emailCollectCoR"),
//	 mailButton("Email to <br>Submit <br>Missing Doc", "Email sent to owner", "emailRegMissingDoc"),
//	 mailButton("Email AIP", "Email sent to owner","emailOwnerAIP"),
//	 mailButton("Memo to OFCA <br>for AIP, <br>new/updated CoR", "Email sent to owner", "memoOfcaAip"),
//	 mailButton("Memo to CO/SD <br>for AIP, <br>new/updated CoR", "Email sent to owner", "memoCosdAip"),

	// ownership buttons
	var btnOwnershipReceiveChange = isc.Button.create(
			{title:"Receive<br>Transfer/Transmit<br>Ownership",
				height:thickBtnHeight,
				click:function(){
					ownerDS.updateData(win.form.getData(), function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_receive"});
				},
			});
	var btnOwnershipAcceptChange = isc.Button.create(
			{title:"Accept<br>Change<br>Ownership",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(formData, function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_accept"});
				},
			});
	var btnOwnershipApproveChange = isc.Button.create(
			{title:"Approve<br>Change<br>Ownership",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(formData, function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_approve"});
				},
			});
	var btnOwnershipReadyCrossCheckCoR = isc.Button.create(
			{title:"Ready to<br>Cross-Check CoR",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(formData, function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_ready"});
				},
			});
	var btnOwnershipCompleteChange = isc.Button.create(
			{title:"Complete<br>Change<br>Ownership",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					getTransaction(function(tx) {
						formData.tx = tx;
						ownerDS.updateData(formData, function(){
							win.markForDestroy();
							refreshInbox();
						}, {operationId:"ownerDS_Tran_complete"});
					});
				},
			});
	var btnOwnershipWithdrawChange = isc.Button.create(
			{title:"Withdraw<br>Change<br>Ownership",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(formData, function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_Tran_withdraw"});
				},
			});

	// owner detail add button functions
//	var btnOwnerDetailClose = isc.Button.create({
//		title:"Close Owner",
//		height:thickBtnHeight,
//		click:function(){
//				win.markForDestroy();
//				refreshInbox();
//		}
//	});
//	var btnOwnerDetailCopyCompanySearch = isc.Button.create({
//		title:"Copy from <br>Company Search",
//		height:thickBtnHeight,
//		click:function(){
//			console.log("copy company search");
//			openCopyCompanySearchForm("Copy Company Search", function(record){
//				form.getField("name").setValue(record.companyName);
//				form.getField("address1").setValue("");
//				form.getField("address2").setValue("");
//				form.getField("address3").setValue("");
//				if (record.registeredOffice.length<=80){
//					form.getField("address1").setValue(record.registeredOffice);
//				} else if (record.registeredOffice.length<=160){
//					form.getField("address1").setValue(record.registeredOffice.substring(0,79));
//					form.getField("address2").setValue(record.registeredOffice.substring(80,record.registeredOffice.length-1));
//				} else {
//					form.getField("address1").setValue(record.registeredOffice.substring(0,79));
//					form.getField("address2").setValue(record.registeredOffice.substring(80,159));
//					if ( record.registeredOffice.length<=240) {
//						form.getField("address3").setValue(record.registedOffice.substring(160, record.registeredOffice.length-1));
//					} else {
//						form.getField("address3").setValue(record.registeredOffice.substring(160,239));
//					}
//				}
//			})
//		}
//	});

	var btnOwnerDetailReceiveChange = isc.Button.create(
			{title:"Receive<br>Owner Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
					ownerDS.updateData(win.form.getData(), function(){
						win.markForDestroy();
						refreshInbox();
					}, {operationId:"ownerDS_change_receive"});
				},
			});
	var btnOwnerDetailWithdrawChange = isc.Button.create(
			{title:"Withdraw<br>Owner Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"ownerDS_change_withdraw"});
				},
			});
	var btnOwnerDetailAcceptChange = isc.Button.create(
			{title:"Accept<br>Owner Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(null, function(){
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"ownerDS_change_accept"});
				},
			});
	var btnOwnerDetailReadyCrossCheckCoR = isc.Button.create(
			{title:"Ready to<br>Cross-Check CoR",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"ownerDS_change_crosscheck"});
				},
			});
	var btnOwnerDetailApproveChange = isc.Button.create(
			{title:"Approve<br>Owner Detail<br>Change",
				height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					ownerDS.updateData(null, function() {
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"ownerDS_change_approve"});
				},
			});
	var btnOwnerDetailCompleteChange = isc.Button.create(
			{title:"Complete <br>Change", height:thickBtnHeight,
				click:function(){
					var formData = win.form.getData();
					formData.taskId = form.taskId;
					getTransaction(function(tx) {
						formData.tx = tx;
						ownerDS.updateData(null, function() {
							win.markForDestroy();
							refreshInbox();
						}, {data:formData, operationId:"ownerDS_change_complete"});
					});
				},
			});

	// builder list buttons
	var btnBuilderListAddBuilder = isc.Button.create(
			{title:"Add<br>Builder",
				height:thickBtnHeight,
				click:function() {
//					openBuilder({"Update Builder":function(bdForm, bdWin){
//						if (bdForm.validate()) {
//							builderDS.addData(bdForm.getData(), function(resp,data,req) {
//								builderDS.fetchData({applNo:bdForm.getData().applNo}, function(resp,data,req) {
//									form.builderGrid.setData(data);
//									bdWin.markForDestroy()
//								});
//							});
//						}
//				}}, form.getData().applNo);
//					openBuilder2(
//						[
//							btnBuilderDetailSave,
//							btnBuilderDetailClose
//						]
//					, form.getData().applNo);
					openBuilderWindow({applNo:form.getData().applNo}, builderFormFields, form.builderGrid, -1, form, mode);
			}
		});
	var btnBuilderListReceiveChange;

	// builder detail button functions
	var btnBuilderDetailClose = isc.Button.create({
			title:"Close Builder<br>Form",
			height:thickBtnHeight,
			click:function(){
				win.markForDestroy();
				refreshInbox();
			}
		});
	var btnBuilderDetailSave = isc.Button.create(
			{title:"Save<br>Builder Detail",
				height:thickBtnHeight,
				click:function(){
					if (win.form.validate()) {
						var formData = win.form.getData();
						if (typeof formData.version != "undefined" && formData.applNo) {
							getTransaction(function(tx) {
								formData.tx = tx;
								builderDS.updateData(null, function() {
									builderDS.fetchData({applNo:formData.applNo},function(resp,data,req){
										builderGrid.setData(data);
										win.markForDestroy();
										refreshInbox();
									});
								}, {data:formData});
							});
						} else if (recordNum >= 0) {
							builderGrid.getData().removeAt(recordNum);
							builderGrid.getData().addAt(formData, recordNum);
							win.markForDestroy();
							refreshInbox();
						} else {
							builderGrid.getData().add(formData);
							win.markForDestroy();
							refreshInbox();
						}
					}
				}
			});

	// mortgage list button functions
	var btnMortgageListNewMortgageRegistration = isc.Button.create(
		{ title:"Register<br>New Mortgage",
			height:thickBtnHeight,
			click:function() {
//				openMortgage({
//					applNo:form.getField("applNo").getValue()
//				}, -1);
				//openBuilderWindow({applNo:form.getData().applNo}, builderFormFields, form.builderGrid, -1, form, mode);
				mortgageDS.updateData({applNo:form.getData().applNo}, function(){
					win.markForDestroy();
					refreshInbox();
				}, {operationId:"mortgageDS_updateData_receive"});
			},
		});
	var btnMortgageListAddMortgage = isc.Button.create({
		title:"Add<br>Mortgage",
		height:thickBtnHeight,
		click:function(){

		}
	});
	var btnMortgageListAcceptMortgageRegistration = isc.Button.create(
			{ title:"Accept<br>Mortgage<br>Application",
				height:thickBtnHeight,
				click:function() {
					var formData = form.getData();
					formData.taskId = form.taskId;
					mortgageDS.updateData({applNo:form.getData().applNo}, function(){
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"mortgageDS_updateData_accept"});
				},
			});
	var btnMortgageListApproveMortgageRegistration = isc.Button.create(
			{ title:"Approve<br>Mortgage<br>Registration",
				height:thickBtnHeight,
				click:function() {
					var formData = form.getData();
					formData.taskId = form.taskId;
					mortgageDS.updateData({applNo:form.getData().applNo}, function(){
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"mortgageDS_updateData_approve"});
				},
			});
	var btnMortgageListCompleteMortgageRegistration = isc.Button.create(
			{ title:"Complete<br>Mortgage<br>Registration",
				height:thickBtnHeight,
				click:function() {
					var formData = form.getData();
					formData.taskId = form.taskId;
					mortgageDS.updateData({applNo:form.getData().applNo}, function(){
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"mortgageDS_updateData_complete"});
				},
			});
	var btnMortgageListWithdrawMortgageRegistration = isc.Button.create(
			{ title:"Withdraw<br>Mortgage<br>Registration",
				height:thickBtnHeight,
				click:function() {
					var formData = form.getData();
					formData.taskId = form.taskId;
					mortgageDS.updateData({applNo:form.getData().applNo}, function(){
						win.markForDestroy();
						refreshInbox();
					}, {data:formData, operationId:"mortgageDS_updateData_withdraw"});
				},
			});

	var taskId = task ? task.id : null;
	var hasApplNo = function() { return record && record.applNo; };
	var isRegistered = function() {
		return hasApplNo() && record.regStatus == 'R';
	};
	var isDeRegistered = function(){
		return hasApplNo() && record.regStatus == 'D';
	}
	var isNotRegistered = function() {
		//20190814 return !isRegistered();
		return record.regStatus == null || record.regStatus == 'A';
	};
	var isCompleteRegistered = function(){
		return isRegistered() || isDeRegistered();
	}
	var latch = 2;
	var form = isc.DynamicForm.create({
		dataSource:"regMasterDS",
		numCols:6,
//		colWidths:[20,20,20,20,20,20,20,20,20,20,],
		fields:[
		        {name:"applNo", disabled:isCompleteRegistered(), type:"staticText"},
		        {name:"applNoSuf", valueMap:{"F":"Full-Reg", "P":"Pro-Reg"}},
		        {name:"corCollect", valueMap:{"HQ":"Headquater", "RD":"Regional Desks"}},
		        {name:"imoNo", disabled:isCompleteRegistered(), endRow:true},
		        {name:"regName", required:true, disabled:isCompleteRegistered(), characterCasing: "upper", width:300, colSpan:2, endRow:true},
		        {name:"regChiName", width:300, disabled:isCompleteRegistered(), colSpan:2, endRow:true}, /////////
		        {name:"callSign", disabled:isCompleteRegistered()},
		        {name:"csResvDate", disabled:isCompleteRegistered(), type:"staticText"}, /////////
		        {name:"offNo", disabled:isCompleteRegistered()},
		        {name:"offResvDate", disabled:isCompleteRegistered(), type:"staticText"}, /////////
		        {name:"intTot", title:"Total Interests"},
		        {name:"intUnit",  title:"Unit of Interest", valueMap:{"S":"Shares", "%":"Percentage", "P":"Parts", "R":"Fraction"}}, /////////
		        {name:"regDate", title:"Reg Date", disabled:isCompleteRegistered(), startRow:true},
		        {name:"regTime", title:"Reg Time", disabled:isCompleteRegistered(), type:"time"},
		        {name:"regStatus", hidden:true},
		        {name:"firstRegDate", startRow:true},
		        {name:"firstRegTime", type:"time",showTitle:false, colSpan:4},

                {name:"provRegDate",  title:"Provisional Reg Date", type:"date", dateFormatter:"dd/MM/yyyy", },
                {name:"provExpDate",  title:"Provisional Expiry Date", type:"date", dateFormatter:"dd/MM/yyyy", },
                {name:"atfDueDate",  title:"ATF Due Date", type:"date", dateFormatter:"dd/MM/yyyy" },
                //{name:"buildYear",  title:"Build Year", type:"integer", },
                {name:"csReleaseDate",  title:"Call Sign Release Date", type:"date", dateFormatter:"dd/MM/yyyy", },

                {name:"transitInd",  title:"Transitional Ind", colSpan:1, }, // TODO enum
                //{name:"dimUnit",  title:"Dim Unit", valueMap:{"F":"feet","B":"metres","M":"metres"}, colSpan:1},
                {name:"genAtfInvoice",  title:"Generated ATF Invoice", length:1, colSpan:1},
                {name:"remark",  title:"Remark", length:80, colSpan:1},
                {name:"agtAgentCode",  title:"Agent", length:3, colSpan:1, },
                {name:"ccCountryCode",  title:"Country", length:3, optionDataSource:"countryDS",displayField:"name",valueField:"id", colSpan:1},
                {name:"operationTypeCode",  title:"Operation Type", length:3, optionDataSource:"operationTypeDS",displayField:"otDesc",valueField:"id", colSpan:1, },
                {name:"rcReasonType",  title:"Reason Type", length:1, type:"hidden", defaultValue:"D"},
                {name:"rcReasonCode",  title:"De-Reg Reason", length:2, optionDataSource:"reasonCodeDS",
                	optionFilterContext:{data:{reasonType:"D"}},
                	displayField:"engDesc",valueField:"reasonCode", changed:function(form,item,value){
                }},
                {name:"shipTypeCode",  visible:false},
                {name:"shipType", shouldSaveValue:false, type:"staticText", title:"Ship Type", length:50, optionDataSource:"shipTypeDS",displayField:"stDesc",valueField:"id",  },
                {name:"shipSubtypeCode",  title:"Ship Subtype", length:50, optionDataSource:"shipSubTypeDS", valueField:"shipSubTypeCode", displayField:"ssDesc",
                	changed: function(form, item, value) {
                		var record = item.getSelectedRecord();
                		if (record) {
                			form.getItem("shipTypeCode").setValue(record.shipTypeCode);
                			form.getItem("shipType").setValue(item.getSelectedRecord().shipTypeEngDesc);
                		} else {
                			form.getItem("shipTypeCode").setValue(null);
                			form.getItem("shipType").setValue("");
                		}
                	}
                },
                {name:"licenseNo",  title:"License No", length:20,  },
                {name:"imoOwnerId", title:"IMO Owner ID",		length:20 },
                {name:"deratedEnginePower", title:"Derated Engine Power",		length:40 },
                {name:"trackCode", title:"Track Code",		length:20, type:"staticText" },
                {name:"certIssueDate", },
                {name:"protocolDate",  },
                {name:"atfYearCount", 		type:"decimal", 	title:"ATF year count"},
                {name:"registrar", 		type:"integer", 	title:"Registrar", optionDataSource:"registrarDS",displayField:"name",valueField:"id"},
                {name:"deRegTime", disabled:isDeRegistered(), dateFormatter:"dd/MM/yyyy HH:mm", format:"dd/MM/yyyy HH:mm",},
                {name:"detainStatus", title:"Detain Status",		length:1 },
                {name:"detainDesc", title:"Detain Desc", type:"textArea", length:160, width:600, colSpan:3,
                	change:function(form, item, value, oldValue) {
                	return value.length <= 160;
                }, },
                {name:"detainDate", type:"date", dateFormatter:"dd/MM/yyyy", title:"Detain Date" },
                /////////
                {name:"cos",type:"section", defaultValue:"Certificate of Survey",
                	itemIds:[
                		"buildYear", "howProp",
                		"buildDate", "surveyShipType","material","grossTon",
                		"regNetTon","length","breadth",
                		"depth", "dimUnit", "engSetNum","engSetNum","noOfShafts",
                		"engPower","engDesc1","estSpeed","engModel1","engModel2",
                		]},
                        {name:"buildYear",  title:"Build Year", type:"integer", },
                		{name:"howProp",  title:"How Propelled"},
                        {name:"buildDate",  title:"Date Keel Laid", startRow:true }, // TODO date or nvarchar
                        {name:"surveyShipType",  title:"Type of Ship"},
                		{name:"material",  title:"Material of Hull"},
                		{name:"grossTon", title:"Gross Tonnage", titleColSpan:3},
                		{name:"regNetTon", title:"Net Tonnage", colSpan:1},
                		{name:"length",  title:"Length", type:"decimal", colSpan:1, },
                		{name:"breadth",  title:"Breadth", type:"decimal", colSpan:1, },
                		{name:"depth",  title:"Depth", type:"decimal", colSpan:1, },
                		{name:"dimUnit",  title:"Unit", valueMap:{"F":"feet","B":"metres","M":"metres"}, colSpan:1, startRow:true, endRow:true},                		{name:"engSetNum",  title:"Engine Set Number", type:"integer", colSpan:1, },
                		{name:"noOfShafts",  title:"No Of Shafts", type:"integer", colSpan:1, },
                		{name:"engPower",  title:"Engine Power", colSpan:1, },
                		{name:"engDesc1",  title:"Engine Desc 1", colSpan:1, },
                		{name:"engModel1",  title:"Engine Model 1", colSpan:3, width:320},
                		{name:"estSpeed",  title:"Estimated Speed", colSpan:1, },
                		{name:"engModel2",  title:"Engine Model 2", colSpan:3, width:320},
    	         {name:"rm.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},

		        {name:"ad", type:"section", defaultValue:"Application Details", itemIds:[
                      //"applDetails.applNo",
                      "applDetails.cs1ClassSocCode",
                      "applDetails.prevName","applDetails.prevPort","applDetails.preOffNo","applDetails.proposeRegDate",
                      "applDetails.auditInsp", "applDetails.applDate",
                      "applDetails.ccCountryCodePrevReg", "applDetails.cfTime",
                      "applDetails.hullNo", "applDetails.placeUponRegister","applDetails.prevChiName",
                      "applDetails.prevRegYear", "applDetails.undertaking",
                      "applDetails.actions"
		                                 ] ,sectionExpanded:false},
	             //{name:"applDetails.applNo", title:"applNo", type:"staticText" },
		         {name:"applDetails.cs1ClassSocCode", title:"Class Society", editorType:"comboBox", colSpan:2},
                 {name:"applDetails.prevName", title:"Previous Name", length:40, colSpan:2},
                 {name:"applDetails.prevChiName", title:"Previous Chinese Name", length:30, colSpan:2},
                 {name:"applDetails.prevPort", title:"Previous Port", length:50, colSpan:2},
                 {name:"applDetails.preOffNo", title:"Previous Official No.", length:9, colSpan:2},
                 {name:"applDetails.proposeRegDate", title:"Proposed Reg Date", type:"date", dateFormatter:"dd/MM/yyyy", colSpan:2},
                 {name:"applDetails.auditInsp", title:"Audit Insp", length:1, colSpan:2},
                 {name:"applDetails.applDate", title:"Application Date", type:"date", dateFormatter:"dd/MM/yyyy", colSpan:2},
                 {name:"applDetails.ccCountryCodePrevReg", title:"Previous Register Country", length:3, colSpan:2},
                 {name:"applDetails.cfTime", title:"Cf Time", type:"date", dateFormatter:"dd/MM/yyyy", colSpan:2},
                 {name:"applDetails.hullNo", title:"Hull No", length:8, colSpan:2},
                 {name:"applDetails.placeUponRegister", title:"Place Upon Register", length:1, colSpan:2},
                 {name:"applDetails.prevRegYear", title:"Prev Reg Year", colSpan:2},
                 {name:"applDetails.undertaking", title:"Undertaking", length:1, colSpan:2},


                 {name:"applDetails.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
 		        {name:"sectionOwner", type:"section", defaultValue:"Owners and Demise", itemIds:["owners","owners.actions"] ,sectionExpanded:false},
                {name:"owners",type:"canvas", colSpan:6, vAlign:"top", showTitle:false},
                {name:"owners.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
  		        {name:"representative",type:"section", defaultValue:"Representative",
		         itemIds:["representative.name","representative.status",
		                  "representative.address1","representative.address2",
		                  "representative.address3", "representative.hkic",
		                  "representative.telNo","representative.faxNo",
		                  "representative.email","representative.incorpCert",
		                  "representative.actions"
		                 ] ,sectionExpanded:true},
	             {name:"representative.name", title:"Name", required:true, colSpan:3, length:160, width:400, characterCasing: "upper"},
	             {name:"representative.status", type:"radioGroup", title:"Status", valueMap:{C:"Corporation",I:"Individual"}, vertical:false, required:true, defaultValue:"C", colSpan:2},
	             {name:"representative.address1", title:"Address", colSpan:5, width:500, length:80, characterCasing: "upper"},
	             {name:"representative.address2", title:"", colSpan:5, width:500, length:80, characterCasing: "upper"},
	             {name:"representative.address3", title:"", colSpan:5, width:500, length:80, characterCasing: "upper"},
	             {name:"representative.telNo", title:"Tel", colSpan:2, endRow:true},
	             {name:"representative.faxNo", title:"Fax", colSpan:2, endRow:true},
	             {name:"representative.email", title:"Email", colSpan:2, endRow:true},
	             {name:"representative.hkic", title:"HKID No.", length:80, characterCasing: "upper", endRow:true},
	             {name:"representative.incorpCert", title:"Incorporate/Reg. Certificate", length:15},
	             {name:"representative.createdDate", type:"hidden"},
	             {name:"representative.updatedDate", type:"hidden"},
	             {name:"representative.createdBy", type:"hidden"},
	             {name:"representative.updatedBy", type:"hidden"},
	             {name:"representative.version", type:"hidden"},
	                {name:"representative.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
  		        {name:"sectionMortgages",type:"section", defaultValue:"Mortgages", itemIds:["mortgages","mortgages.actions"] ,sectionExpanded:false},
	                {name:"mortgages",type:"canvas", colSpan:6, vAlign:"top", showTitle:false},
	                {name:"mortgages.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
  		        {name:"sectionBuilders",type:"section", defaultValue:"Builders/Makers", itemIds:["builders","builders.actions"] ,sectionExpanded:false},
				{name:"builders",type:"canvas", colSpan:6, vAlign:"top", showTitle:false},
				{name:"builders.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
				{name:"sectionInjuctions",type:"section", defaultValue:"Injunctions", itemIds:["injuctions","injuctions.actions"] ,sectionExpanded:false},
				{name:"injuctions",type:"canvas", colSpan:6, vAlign:"top", showTitle:false},
                {name:"injuctions.actions", type:"canvas", layoutAlign :"right", colSpan:6 , showTitle:false,height:22},
 		        {name:"sectionDoc", type:"section", defaultValue:"Document Checklist", itemIds:["docs"] ,sectionExpanded:false},
                {name:"docs",type:"canvas", colSpan:6, vAlign:"top", showTitle:false},
		],
		//cellBorder:"solid",
		getData: function() {
			var data = this.getValues();
			if (data.rcReasonCode != null) {
				data.rcReasonType = 'D';
			}
			if (data.regDate && data.regTime) {
				data.regDate = new Date(isc.DateUtil.format(data.regDate, 'yyyy-MM-dd ') + isc.DateUtil.format(data.regTime, 'HH:mm'));
			}
			if (data.firstRegDate && data.firstRegTime) {
				data.firstRegDate = new Date(isc.DateUtil.format(data.firstRegDate, 'yyyy-MM-dd ') + isc.DateUtil.format(data.firstRegTime, 'HH:mm'));
			}
			return data;
		},
		setData: function(data) {
			this.setValues(data);
			this.getField("regTime").setValue(data.regDate);
			this.getField("firstRegTime").setValue(data.firstRegDate);
			if (form.getItem("applNo").getValue()) {
				var applNo =form.getItem("applNo").getValue();
				latch += 6;
				ownerDS.fetchData({applNo:applNo},function(resp,data,req){
					form.ownerGrid.setData(data);
					loaded();
				});
				repDS.fetchData({applNo:applNo}, function(resp,data,req){
					if (data.length > 0) {
						setRep(data[0]);
					}
					loaded();
				});
				applDetailDS.fetchData({applNo:applNo}, function(resp,data,req){
					if (data.length > 0) {
						setAd(data[0]);
					}
					loaded();
				});
				mortgageDS.fetchData({applNo:applNo}, function(resp,data,req){
					form.mortgageGrid.setData(data);
					loaded();
				});
				builderDS.fetchData({applNo:applNo}, function(resp,data,req){
					form.builderGrid.setData(data);
					loaded();
				});
				injuctionDS.fetchData({applNo:applNo}, function(resp,data,req){
					form.injuctionGrid.setData(data);
					loaded();
				});
				if (record.shipTypeCode) {
					latch += 1;
					shipTypeDS.fetchData({id:record.shipTypeCode}, function(resp,data,req){
						if (data.length > 0) {
							form.getItem("shipType").setValue(data[0].stDesc);
						}
						loaded();
					});
				}
			}
		}
	});

	var addButtons = function(itemName, props){
		var buttons = [];
		props.forEach(function(i) {
			if (i.showIf == undefined || i.showIf()) {
				buttons.add(isc.Button.create(i));
			}
		});
		form.getItem(itemName).canvas.addChild(
				isc.HLayout.create(
						{ width:1000,
							defaultLayoutAlign :"right",
							layoutAlign :"right",
							align :"right",
							height:22,
							members:buttons}));
	};

	var addButtons2 = function(itemName, btns){
		var buttons = [];
		btns.forEach(function(i) {
			//if (i.showIf == undefined || i.showIf()) {
			//	buttons.add(isc.Button.create(i));
			//}
			buttons.add(i);
		});
		form.getItem(itemName).canvas.addChild(
				isc.HLayout.create(
						{ width:1000,
							defaultLayoutAlign :"right",
							layoutAlign :"right",
							align :"right",
							height:22,
							members:buttons}));
	};

	addButtons("rm.actions", []);
	addButtons("applDetails.actions",
			[
			 {title:"Update", click:function()
				 {
					//var formData = form.getData()["representative"];
					//formData.applNo = form.getField("applNo").getValue();
				 console.log(form.getItem("applNo"));
				 console.log(form.getData().applNo);
					 if (form.validate()) {
						 var formData = form.getData()["applDetails"];
						 var applDetails = formData;
						 //applDetails.applNo = form.getField("applNo").getValue();
						 applDetails.applNo = form.getItem("applNo").getValue();
						 applDetails.applDate = formData.applDate;
						 applDetails.auditInsp = formData.auditInsp;
						 applDetails.ccCountryCodePrevReg = formData.ccCountryCodePrevReg;
						 applDetails.cfTime = formData.cfTime;
						 applDetails.cs1ClassSocCode = formData.cs1ClassSocCode;
						 applDetails.hullNo = formData.hullNo;
						 applDetails.placeUponRegister = formData.placeUponRegister;
						 applDetails.preOffNo = formData.preOffNo;
						 applDetails.prevChiName = formData.prevChiName;
						 applDetails.prevName = formData.prevName;
						 applDetails.prevPort = formData.prevPort;
						 applDetails.prevRegYear = formData.prevRegYear;
						 applDetails.proposeRegDate = formData.proposeRegDate;
						 applDetails.undertaking = formData.undertaking;
						 copyVer(form.applDetails, applDetails);
						 applDetailDS.updateData(applDetails, function(resp,data,req) {
							 setAd(data);
						 });
					 }
				 }, height: thickBtnHeight,
			 },
        	 {title:"Email Cls Soc<br>for change <br>of CoR", click:function(){
        		 var formData = form.getData();
        		 if (formData.applDetails && formData.applDetails.cs1ClassSocCode) {
        			 regMasterDS.addData(form.getData(), function(resp,data,req){
        				 isc.say("Email sent to class society");
        			 }, {operationId:"emailClassSocCoR"});
        		 } else {
    				 isc.say("No class society selected");
        		 }
        	 }, height: thickBtnHeight},
        	 {title:"Memo to OFCA <br>for change <br>of CoR", click:function(){
        		 var formData = form.getData();
        		 regMasterDS.addData(form.getData(), function(resp,data,req){
        			 isc.say("Email sent to OFCA");
        		 }, {operationId:"memoOfcaCoR"});
        	 }, height: thickBtnHeight},
        	 {title:"Memo to CO/SD <br>for change <br>of CoR", click:function(){
        		 var formData = form.getData();
        		 regMasterDS.addData(form.getData(), function(resp,data,req){
        			 isc.say("Email sent to CO/SD");
        		 }, {operationId:"memoCosdCoR"});
        	 }, height: thickBtnHeight},
			]);
	var mailButton = function(title, message, operationId) {
		return {title:title, click:function(){ regMasterDS.addData(form.getData(), function(resp,data,req){
   		 isc.say(message);
   	 }, {operationId:operationId}); }, height: thickBtnHeight, width:140};
	};

//	addButtons("owners.actions", [
//          {/*showIf:isNotRegistered, */
//        	  title:"Add Owner", click:function() { openOwnerWindow({type:"C"}, form.ownerGrid, -1, form); }, height: thickBtnHeight,
//          },
//		  {/*showIf:isNotRegistered, */
//			  title:"Remove Owner", click:function() { form.ownerGrid.removeSelectedData(); }, height: thickBtnHeight,
//		  },
//		  {/*showIf:isNotRegistered, */
//			  title:"Save", click:function()
//			  {
//				if (form.getField("applNo").getValue()) {
//					form.ownerGrid.getData().forEach(function(owner) {
//						owner.applNo = form.getField("applNo").getValue();
//					});
//					ownerDS.updateData({},
//						function(resp,data,req) {
//							form.ownerGrid.setData(data);
//						}, {operationId:"ownerDS_updateData_owners",data:{owners:form.ownerGrid.getData().toArray()}});
//				}
//        	 }, height: thickBtnHeight,},
//        	 {title:"Copy to <br>Representative", click:function(){
//        		 if (form.ownerGrid.getSelection().length == 1) {
//        			 var owner = form.ownerGrid.getSelection()[0];
//        			 form.getItem("representative.name").setValue(owner.name);
//        			 form.getItem("representative.status").setValue(owner.status);
//        			 form.getItem("representative.address1").setValue(owner.address1);
//        			 form.getItem("representative.address2").setValue(owner.address2);
//        			 form.getItem("representative.address3").setValue(owner.address3);
//        			 form.getItem("representative.telNo").setValue("");
//        			 form.getItem("representative.faxNo").setValue("");
//        			 form.getItem("representative.email").setValue(owner.email);
//        			 form.getItem("representative.incorpCert").setValue(owner.incortCert);
//        		 }
//    		 }, height: thickBtnHeight},
//        	 mailButton("Email to <br>Collect CoR", "Email sent to owner", "emailCollectCoR"),
//        	 mailButton("Email to <br>Submit <br>Missing Doc", "Email sent to owner", "emailRegMissingDoc"),
//        	 mailButton("Email AIP", "Email sent to owner","emailOwnerAIP"),
//        	 mailButton("Memo to OFCA <br>for AIP, <br>new/updated CoR", "Email sent to owner", "memoOfcaAip"),
//        	 mailButton("Memo to CO/SD <br>for AIP, <br>new/updated CoR", "Email sent to owner", "memoCosdAip"),
//		 ]);

//	addButtons("mortgages.actions", [
//		{title:"Register", click:function() {
//			openMortgage({
//				applNo:form.getField("applNo").getValue()
//			}, -1);
//		}, },
//		]);

//	addButtons("builders.actions", [
//		{title:"Add Builder", click:function() {
//			openBuilder({"Update Builder":function(bdForm, bdWin){
//				if (bdForm.validate()) {
//					builderDS.addData(bdForm.getData(), function(resp,data,req) {
//						builderDS.fetchData({applNo:bdForm.getData().applNo}, function(resp,data,req) {
//							form.builderGrid.setData(data);
//							bdWin.markForDestroy()
//						});
//					});
//				}
//			}}, form.getData().applNo);
//
//		}, },
//		]);
//	addButtons("injuctions.actions", [
//		{title:"Add Injunction", click:function() {
//			openInjuction({"Add Injunction":function(injForm, injWin){
//				if (injForm.validate()) {
//					injuctionDS.addData(injForm.getData(), function(resp,data,req) {
//						injuctionDS.fetchData({applNo:injForm.getData().applNo}, function(resp,data,req) {
//							form.injuctionGrid.setData(data);
//							injWin.markForDestroy()
//						});
//					});
//				}
//			}}, form.getData().applNo);
//		}, },
//		]);

	// OWNER
	var ownerFormFields = [
						{name:"applNo",title:"Appl No.",type:"staticText" },// value:applNo},
	      		        {name:"type", title:"Owner Type", required:true, width:100, length:1, valueMap:["C", "D"], changed:function(form,item,value){
	      		        	if ("D" == value) { form.getItem("incorpPlace").setValue("HONG KONG"); }
	      		        }},
	      		        {name:"ownerSeqNo", title:"Owner Seq No.", width:100, required:true},
    					{name:"majorOwner" , title:"Major Owner", type:"radioGroup", valueMap:[true,false], vertical:false, width:100, defaultValue:true},
	       		        {name:"name", title:"Owner Name", required:true, width:400, length:160, characterCasing: "upper"},
	    		        {name:"address1", title:"Address", width:400, length:80, characterCasing: "upper"},
	    		        {name:"address2", title:"", width:400, length:80, characterCasing: "upper"},
	    		        {name:"address3", title:"", width:400, length:80, characterCasing: "upper"},
	    		        //{name:"incorpPlace", title:"Owner Place Of Incorporation", type:"text", width:200, optionDataSource:"countryDS", displayField:"name", valueField:"name", allowEmptyValue:true},
	    		        {name:"email", title:"Email", width:200, length:50},
    					{name:"status", title:"Status" , type:"radioGroup", valueMap:{"C":"Corporation", "I":"Individual"}, vertical:false},
    					{name:"qualified", title:"Qualified Owner", type:"radioGroup", valueMap:{"Y":"Yes", "N":"No"}, vertical:false },
    					{name:"nationPassport", title:"Passport", width:100 },
    					{name:"intMixed", title:"Shares/Percentage Held", type:"integer", align:"left", width:100 },
    					{name:"intNumberator", title:"Int Numerator", type:"integer", align:"left", width:100 },
    					{name:"intDenominator" , title:"Int Denominator", type:"integer", align:"left", width:100},
    	                {name:"sectionIndividualOwner",type:"section", defaultValue:"Individual Owner",
    	                	itemIds:[
    	                		"hkic", "occupation",
    	                		]},
    					{name:"hkic" , title:"HKID No.", width:200},
    					{name:"occupation" , title:"Occupation", width:200},
       	                {name:"sectionCorporateOwner",type:"section", defaultValue:"Corporate Owner",
    	                	itemIds:[
    	                		"incortCert", "overseaCert", "regPlace" ,"incorpPlace",
    	                		]},
    					{name:"incortCert" , title:"Incorporate Certificate", width:100, length:15},
    					{name:"overseaCert" , title:"Oversea Certificate", width:100},
    					{name:"regPlace" , title:"Place of Registration", type:"text", width:200, optionDataSource:"countryDS", displayField:"name", valueField:"name", allowEmptyValue:true},
	    		        {name:"incorpPlace", title:"Owner Place Of Incorporation", type:"text", width:200, optionDataSource:"countryDS", displayField:"name", valueField:"name", allowEmptyValue:true},
       	                {name:"sectionDemiseCharter",type:"section", defaultValue:"Demise Charter",
    	                	itemIds:[
    	                		"charterSdate", "charterEdate",
    	                		]},
    					{name:"charterSdate", title:"Charter Period Start", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy", align:"left", width:150 },
    					{name:"charterEdate", title:"Charter Period End", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy", align:"left", width:150 },
    					//{name:"corrAddr1" , title:"Correspondence Address", width:400, length:80},
    					//{name:"corrAddr2" , title:"", width:400, length:80},
    					//{name:"corrAddr3" , title:"", width:400, length:80},
	    		        ];

//	var builderFormFields = [
//		{name:"applNo",title:"Appl No.",type:"staticText" },// value:applNo},
//		{name:"builderCode",title:"Code", required:true, unmodifiable:true, length:1, defaultValue:"S", hidden:true},
//		{name:"name",title:"Name", required:true, unmodifiable:true, width:400 , characterCasing: "upper"},
//		{name:"address1",title:"Addr", required:true, width:400, length:40, characterCasing: "upper"},
//		{name:"address2",title:"", width:400, length:40, characterCasing: "upper"},
//		{name:"address3",title:"", width:400, length:40, characterCasing: "upper"},
//		{name:"email",title:"Email", width:200},
//		{name:"major",title:"Major", length:1, valueMap:["Y","N"], defaultValue:"Y", required:true},
//	];
	var builderFormFields = [
		{name:"applNo",title:"Appl No.",type:"staticText" },// value:applNo},
		{name:"builderCode",title:"Code", required:true, unmodifiable:true, length:1, defaultValue:"S"},
		{name:"name",title:"Name", required:true, width:400 , characterCasing: "upper"},
		{name:"address1",title:"Addr", required:true, width:400, length:40, characterCasing: "upper"},
		{name:"address2",title:"", width:400, length:40, characterCasing: "upper"},
		{name:"address3",title:"", width:400, length:40, characterCasing: "upper"},
		{name:"email",title:"Email", width:200},
		{name:"major",title:"Major", length:1, valueMap:["Y","N"], defaultValue:"Y", required:true},
	];
	var injunctionFormFields = [
		{name:"applNo",title:"Appl No.",type:"staticText"}, //value:applNo},
		{name:"injuctionCode",title:"Code", required:true, unmodifiable:true},
		{name:"injuctionDesc",title:"Description", required:true, width:200},
		{name:"expiryDate",title:"Expiry Date", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy"},
	];
	var mortgageFormFields = [
        {name:"mortStatus", title:"Status", valueMap:mortgageDS.getField("mortStatus").valueMap, required:true},
        {name:"priorityCode", title:"Mortgage Code", required:true, changed:function(form,item,value){
        	if (value == "A") {
        		form.getItem("higherMortgageeConsent").setValue("N");
        	}
        }},
        {name:"higherMortgageeConsent", title:"Higher Mortgage Consent", required:true,
        	length:1, type:"radioGroup", valueMap:["Y", "N"], vertical:false},
        {name:"agreeTxt", title:"Agreement Text", width:400, length:2000},
        {name:"mortgagors", title:"Mortgagor", editorType:"MultiComboBoxItem", required:true},
        {name:"mortgagees", title:"Mortgagee", type:"canvas", colSpan:"2", showTitle:false},
      ];


	form.ownerGrid = isc.ListGrid.create({
		width:1150,
		height:120,
		//fields:ownerFields,
		fields:[
		        {name:"type", title:"Type", width:50},
  		        {name:"ownerSeqNo", title:"Seq No.", width:80},
				{name:"majorOwner" , title:"Major", width:50},
   		        {name:"name", title:"Name", width:200, },
		        {name:"address1", title:"Address", width:200},
		        //{name:"address2", title:"", width:100},
		        //{name:"address3", title:"", width:100},
				{name:"status", title:"Status", width:100, valueMap:{C:"Corporation",I:"Individual"}},
				{name:"qualified", title:"Qualified Owner", width:100},
				{name:"intMixed", title:"Interest", type:"integer", width:80},
				{name:"charterSdate", title:"Charter Start", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy", width:120},
				{name:"charterEdate", title:"Charter End", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy", width:120},
		],
		rowDoubleClick: function(owner, recordNum, fieldNum){
			openOwnerWindow(owner, ownerFormFields, form.ownerGrid, recordNum, form, mode);
		},
//		rowDoubleClick: function(record, recordNum, fieldNum){
//			openOwnerWindow(record, ownerFormFields, form.ownerGrid, recordNum, form);
//		},
	});

	form.getItem("owners").canvas.addChild(isc.VLayout.create({members:[form.ownerGrid]}));
	form.getItem("owners").canvas.children[0].setWidth(1000);

	// MORTGAGE
	var mortgageFields = [
	                      {name:"mortStatus", title:"Status", valueMap:mortgageDS.getField("mortStatus").valueMap, required:true},
	      		        {name:"priorityCode", title:"Mortgage Code", required:true, changed:function(form,item,value){
	      		        	if (value == "A") {
	      		        		form.getItem("higherMortgageeConsent").setValue("N");
	      		        	}
	      		        }},
	    		        {name:"higherMortgageeConsent", title:"Higher Mortgage Consent", required:true,
	      		        	length:1, type:"radioGroup", valueMap:["Y", "N"], vertical:false},
	    		        {name:"agreeTxt", title:"Agreement Text", width:400, length:2000},
	    		        {name:"mortgagors", title:"Mortgagor", editorType:"MultiComboBoxItem", required:true},
	    		        {name:"mortgagees", title:"Mortgagee", type:"canvas", colSpan:"2", showTitle:false},
	    		        ];

	var openMortgage = function(mortgage, recordNum, closeCallback) {
		console.log("mortgage: " + mortgage);
		console.log("recordNum:" + recordNum);
		var editor = openEditor(mortgageFields.subList(1, mortgageFields.length), {}, "", mortgage, "Mortgage", mortgageWinWidth, mortgageWinHeight);
		if (recordNum == -1 && !mortgage.priorityCode) {
			mortgageDS.fetchData(
					{ applNo:form.getItem("applNo").getValue()},
					  function(resp,data,req){
						 // mortgage code is equivalent to priority code
						editor.form.getField("priorityCode").setValue(data);
						if (data == "A") {
							editor.form.getItem("higherMortgageeConsent").setValue("N");
      		        	}
					  },
					{operationId:"nextMortgageCode"}
				);
			editor.items[1].addMember( isc.Button.create({title:"Receive<br>Application", height:thickBtnHeight, click: function() {
				if (editor.form.validate()) {
					var data = editor.form.getData();
					data.applNo = mortgage.applNo;
					data.mortStatus = 'R'; // receive
					mortgageDS.addData({}, function(resp,data,req) {
						editor.markForDestroy();
						mortgageDS.fetchData({applNo:form.getItem("applNo").getValue()}, function(resp,data,req){
							form.mortgageGrid.setData(data);
						});
						refreshInbox();
					}, {data:data});
				}
			}}), 0);
		}
		if (recordNum != -1 && editor.form.getData().applNo && editor.form.getData().priorityCode) {
			var removeOp = function(operationId, tx){
				if (editor.form.validate()) {
					var data = editor.form.getData();
					data.applNo = mortgage.applNo;
					data.taskId = form.taskId;
					data.tx = tx;
					copyVer(mortgage, data);
					mortgageDS.removeData({}, function(resp,data,req) {
						editor.markForDestroy();
						if (closeCallback) {
							closeCallback();
						} else {
							mortgageDS.fetchData({applNo:form.getItem("applNo").getValue()}, function(resp,data,req){ form.mortgageGrid.setData(data); });
						}
						refreshInbox();
					}, {operationId:operationId, data:data});
				}
			};
			var updateOp = function(operationId, tx){
				if (editor.form.validate()) {
					var data = editor.form.getData();
					data.applNo = mortgage.applNo;
					data.taskId = form.taskId;
					data.tx = tx;
					copyVer(mortgage, data);
					mortgageDS.updateData({}, function(resp,data,req) {
						editor.markForDestroy();
						if (closeCallback) {
							closeCallback();
						} else {
							mortgageDS.fetchData({applNo:form.getItem("applNo").getValue()}, function(resp,data,req){ form.mortgageGrid.setData(data); });
						}
						refreshInbox();
					}, {operationId:operationId, data:data});
				}
			};


			if (mortgage.mortStatus == "A" && !form.taskId) {
				editor.items[1].addMember( isc.Button.create({title:"Discharge <br>Mortgage", height:thickBtnHeight,
					click: function() {
						removeOp("mortgageDS_discharge_receive");
					} }), 0);
				editor.items[1].addMember( isc.Button.create({title:"Transfer <br>Mortgage", height:thickBtnHeight,
					click: function() {
						updateOp("mortgageDS_transfer_receive");
					}}), 0);
				editor.items[1].addMember( isc.Button.create({title:"Cancel <br>Mortgage", height:thickBtnHeight,
					click: function() {
						removeOp("mortgageDS_cancel_receive");
					}}), 0);
				editor.items[1].addMember( isc.Button.create({title:"Mortgage Details <br>Change", height:thickBtnHeight,
					click: function() {
						updateOp("mortgageDS_detail_receive");
					}}), 0);
				editor.items[1].addMember( isc.Button.create({title:"Mortgagee Details <br>Change", height:thickBtnHeight,
					click: function() {
						updateOp("mortgageDS_mortgagee_receive");
					}}), 0);
			}

			var editorMember = function (requiredTodo, buttonLabel, callBack) {
				if (form.todo.contains(requiredTodo) && form.task && form.task.param2 == mortgage.priorityCode) {
					editor.items[1].addMember(isc.Button.create({title:buttonLabel, height:thickBtnHeight, click:callBack}),0);
				}
			};

			editorMember("acceptRegisterMortgage", "Accept <br>Register", function(){ updateOp("mortgageDS_updateData_accept"); } );
			editorMember("approveRegisterMortgage", "Approve <br>Register", function(){ updateOp("mortgageDS_updateData_approve"); } );
			editorMember("completeRegisterMortgage", "Complete <br>Register", function(){ getTransaction(function(tx) { updateOp("mortgageDS_updateData_complete", tx);}) } );
			editorMember("withdrawRegisterMortgage", "Withdraw <br>Register", function(){ updateOp("mortgageDS_updateData_withdraw"); } );
			editorMember("acceptTransferMortgage", "Accept <br>Transfer", function(){ updateOp("mortgageDS_transfer_accept"); } );
			editorMember("approveTransferMortgage", "Approve <br>Transfer", function(){ updateOp("mortgageDS_transfer_approve"); } );
			editorMember("completeTransferMortgage", "Complete <br>Transfer", function(){ getTransaction(function(tx) { updateOp("mortgageDS_transfer_complete", tx);}) } );
			editorMember("withdrawTransferMortgage", "Withdraw <br>Transfer", function(){ updateOp("mortgageDS_transfer_withdraw"); } );

			editorMember("acceptDischargeMortgage", "Accept Discharge", function(){ removeOp("mortgageDS_discharge_accept"); } );
			editorMember("approveDischargeMortgage", "Approve Discharge", function(){ removeOp("mortgageDS_discharge_approve"); } );
			editorMember("completeDischargeMortgage", "Complete Discharge", function(){ getTransaction(function(tx) { removeOp("mortgageDS_discharge_complete", tx);}) } );
			editorMember("withdrawDischargeMortgage", "Withdraw Discharge", function(){ removeOp("mortgageDS_discharge_withdraw"); } );
			editorMember("acceptCancelMortgage", "Accept Cancel", function(){ removeOp("mortgageDS_cancel_accept"); } );
			editorMember("approveCancelMortgage", "Approve Cancel", function(){ removeOp("mortgageDS_cancel_approve"); } );
			editorMember("completeCancelMortgage", "Complete Cancel", function(){ getTransaction(function(tx) { removeOp("mortgageDS_cancel_complete", tx);}) } );
			editorMember("withdrawCancelMortgage", "Withdraw Cancel", function(){ removeOp("mortgageDS_cancel_withdraw"); } );

			editorMember("acceptMortgageDetails", "Accept Mortgage Details Change", function(){ updateOp("mortgageDS_detail_accept"); } );
			editorMember("approveMortgageDetails", "Approve Mortgage Details Change", function(){ updateOp("mortgageDS_detail_approve"); } );
			editorMember("completeMortgageDetails", "Complete Mortgage Details Change", function(){ getTransaction(function(tx) { updateOp("mortgageDS_detail_complete", tx);}) } );
			editorMember("withdrawMortgageDetails", "Withdraw Mortgage Details Change", function(){ updateOp("mortgageDS_detail_withdraw"); } );

			editorMember("acceptMortgageeDetails", "Accept Mortgagee Details Change", function(){ updateOp("mortgageDS_mortgagee_accept"); } );
			editorMember("approveMortgageeDetails", "Approve Mortgagee Details Change", function(){ updateOp("mortgageDS_mortgagee_approve"); } );
			editorMember("completeMortgageeDetails", "Complete Mortgagee Details Change", function(){ getTransaction(function(tx) { updateOp("mortgageDS_mortgagee_complete", tx);}) } );
			editorMember("withdrawMortgageeDetails", "Withdraw Mortgagee Details Change", function(){ updateOp("mortgageDS_mortgagee_withdraw"); } );
		}


		editor.form.getField("mortgagors").setValueMap(form.ownerGrid.getData().filter(function(owner){ return owner.type != 'D'; }).map(function(t){ return t.name;}));
//		editor.setHeight(460);
//		editor.setWidth(640);
		var addMortgageeClick = function(){
			var showLink = vlayout.getMembersLength() > 0;
			var mForm = isc.DynamicForm.create({
				numCols:3,
				fields:[{name:"name", title:"Mortgagee Name", required:true, width:400, characterCasing: "upper",
					optionDataSource:"financeCompanyDS", displayField:"name",
		        	changed:function(form,item,value){
		        		financeCompanyDS.fetchData({name:value}, function(resp, data, req) {
		        			if (data.length > 0) {
		        				form.getItem("address1").setValue(data[0].addr1);
		        				form.getItem("address2").setValue(data[0].addr2);
		        				form.getItem("address3").setValue(data[0].addr3);
		        				form.getItem("email").setValue(data[0].email);
		        				form.getItem("faxNo").setValue(data[0].faxNo);
		        				form.getItem("telNo").setValue(data[0].telNo);
		        			}
		        		});
		        	},
					},
				        {name:"address1", title:"Address", colSpan:2, width:400, characterCasing: "upper"},
				        {name:"address2", title:"", colSpan:2, width:400, characterCasing: "upper"},
				        {name:"address3", title:"", colSpan:2, width:400, characterCasing: "upper"},
				        {name:"email", title:"Telex No./Email"},
				        {name:"faxNo", title:"Fax"},
				        {name:"telNo", title:"Tel"},
				        {showIf:function(){ return showLink; },showTitle:false,type:"link",linkTitle:"Remove", target:"javascript", click:function(form,link,evt){
				        	form.parentElement.removeMember(form);
				        	}},
                      ]});
			vlayout.addMember(mForm, vlayout.getMembersLength());
			return mForm;
		};
		if ( ! ["W","D","C"].contains(mortgage.mortStatus)) {
			editor.items[1].addMember(isc.Button.create({title:"Add<br>Mortgagee", height:thickBtnHeight, click:addMortgageeClick}),0);
		}
		editor.items[1].addMember(isc.Button.create(
				{title:"Amend<br>Mortgage",
					height:thickBtnHeight,
					click:function(){
						updateOp("amend");
					}
				}),0);

		var vlayout = isc.VLayout.create({members:[]});
		editor.form.getField("mortgagees").canvas.addChild(vlayout);
		editor.form.getData = function() {
			var formData = editor.form.getValues();
			formData.mortgagees = [];
			vlayout.members.forEach(function(m) { if (m.getData) { formData.mortgagees.add(m.getData()); } });
			return formData;
		};
		if (mortgage && mortgage.applNo && mortgage.priorityCode) {

			mortgagorDS.fetchData(mortgage, function(res,mortgagors,req){
				editor.form.getField("mortgagors").setValue(mortgagors.map(function(_m) { return _m.owner.name; } ));
				editor.mortgagors = mortgagors;
			});
			mortgageeDS.fetchData(mortgage, function(res,mortgagees,req){
				var i = 0;
				while (i < mortgagees.length) {
					if (vlayout.getMembersLength() <= i){
						addMortgageeClick();
					}
					vlayout.members[i].setData(mortgagees[i]);
					i++;
				}
				editor.mortgagees = mortgagees;
			});

		}
		if (vlayout.getMembersLength() == 0) {
			addMortgageeClick();
		}

		__openMortgage__ = editor;
		return editor;
	};
	form.mortgageGrid = isc.ListGrid.create({
		width:1000,
		height:120,
		dataSource:mortgageDS,
		fields:mortgageFields.subList(0,4),
		rowDoubleClick: function(mortgage, recordNum, fieldNum){
			mortgage.applNo = form.getData().applNo;
			openMortgage(mortgage,recordNum);
		},
	});

	form.getItem("mortgages").canvas.addChild(isc.VLayout.create({members:[form.mortgageGrid]}));
	form.getItem("mortgages").canvas.children[0].setWidth(1000);

	var builderFields = [
		{name:"applNo", hidden:true},
		{name:"seqNo", hidden:true},
		{name:"builderCode", title:"Code", valueMap:{"E":"E","S":"S"}, length:1},
		{name:"name", title:"Name", length:40},
		{name:"address", type:"summary", title:"Address", recordSummaryFunction:function(row){ return row.address1 + (row.address2 ? " " + row.address2 : "") + (row.address3 ? " " + row.address3 : "") ;}},
		{name:"email", title:"Email"},
		{name:"major", title:"Major", valueMap:{"Y":"Y","N":"N"}},
        ];
	var injuctionFields = [
		{name:"applNo", hidden:true},
		{name:"injuctionCode", title:"Code"},
		{name:"injuctionDesc", title:"Desc"},
		{name:"expiryDate", title:"Expiry", type:"date", dateFormatter:"dd/MM/yyyy", format:"dd/MM/yyyy"},
        ];

	form.builderGrid = isc.ListGrid.create({
		width:1000,
		height:120,
		fields:builderFields,
		rowDoubleClick: function(record, recordNum, fieldNum){
			openBuilderWindow(record, builderFormFields, form.builderGrid, recordNum, form, mode);
//			openBuilder({"Change Receive": function(bdForm,bdWin){
//				builderDS.updateData(null, function(){
//					builderDS.fetchData({applNo:record.applNo}, function(resp,data,req){
//						form.builderGrid.setData(data);
//						bdWin.markForDestroy();
//						refreshInbox();
//					});
//				}, {operation:"builderDS_changeReceive", data:bdForm.getData()});
//			}, "Delete":function(bdForm,bdWin){
//				builderDS.removeData(record, function(resp,data,req) {
//					builderDS.fetchData({applNo:record.applNo}, function(resp,data,req){
//						form.builderGrid.setData(data);
//						bdWin.markForDestroy();
//					});
//				});
//			}}, form.getData().applNo, record);
		},
	});

	form.getItem("builders").canvas.addChild(isc.VLayout.create({members:[form.builderGrid]}));
	form.getItem("builders").canvas.children[0].setWidth(1000);

	form.injuctionGrid = isc.ListGrid.create({
		width:1000,
		height:120,
		fields:injuctionFields,
		rowDoubleClick: function(record, recordNum, fieldNum){
			openInjuction({
					"Change Injunction": function(injForm,injWin){
						injuctionDS.updateData(injForm.getData(), function(){
							injuctionDS.fetchData({applNo:record.applNo}, function(resp,data,req){
								form.injuctionGrid.setData(data);
								injWin.markForDestroy();
							});
						});
					},
					"Delete":function(injForm,injWin){
						injuctionDS.removeData(record, function(resp,data,req) {
							injuctionDS.fetchData({applNo:record.applNo}, function(resp,data,req){
								form.injuctionGrid.setData(data);
								injWin.markForDestroy();
							});
						});
					}
				}, form.getData().applNo, record);
		},
	});

	form.getItem("injuctions").canvas.addChild(isc.VLayout.create({members:[form.injuctionGrid]}));
	form.getItem("injuctions").canvas.children[0].setWidth(1000);

	var docFields = [];

	var rmForm = form;

	var addDoc = function(value) {
		if (typeof value.header != "undefined") {
			docFields.add({type:"staticText", showTitle:false, value:"<b>"+value.header+"</b>", colSpan:4, shouldSaveValue:false});
		} else {
			docFields.add({type:"checkbox", valueMap:[null, "Y"],name:value.require, title:value.title, showTitle:false});
			docFields.add({type:"select", name:value.state, valueMap:{"":"", "X":"Received","A":"Accepted","R":"Rejected"/*, "":"Reset"*/}, showTitle:false,defaultValue:value.value});
			docFields.add({type:"blob", name:"upload_" + value.title, showTitle:false, canEdit:true, startRow:false, endRow:false, accept:"application/pdf"});
			docFields.add({type:"button", title:"Download", startRow:false, endRow:false, click:function() {
				window.open("./dmsImage/?DOC_TYPE=SR-Supporting Document&IMO number=" +rmForm.getData().imoNo
						+"&Official number=" +rmForm.getData().offNo
						+"&Ship Name=__EMPTY__"
						+"&Supporting Type=" + value.title +"&OUTPUT_FORMAT=bytes&Content-Type=application/pdf");
			}, shouldSaveValue:false});
		}
	};
	[
	 {header:"Forms"},
	 {title:"Application for Registration", state:"applForm", require:"applRegRequire" },
	 {title:"Declaration of Entitlement", state:"entitle", require:"declEntitleReq" },
	 {title:"Declaration of Entitlement w/Charter Party", state:"demiseEntitle", require:"declEntitleDcReq" },

	 //
	 {header:"Company Documents"},
	 {title:"Owner company registration document (copy)", state:"incorpHkid", require:"ownerRegDocReq" },
	 {title:"Owner business registration (copy)", state:"docCertifiedIncorpCert", require:"ownerBusinessReq" },
	 {title:"Form of authority of POA (Owner)", state:"formAuth", require:"ownerFormAuthReq" },
	 {title:"Owner Declaration of \"No-Seal\"", state:"appFullReg", require:"ownerDeclNosealReq" },
	 {title:"DC company registration document(copy)", state:"demiseIncorpHkid", require:"dcReqDocReq" },
	 {title:"DC business registration (copy)", state:"demiseExA", require:"dcBusinessReq" },
	 {title:"Form of Authority of POA (Demise charterer)", state:"demiseFormAuth", require:"dcFormAuthReq" },
	 {title:"DC Declaration of \"No-Seal\"", state:"demiseExB", require:"dcDeclNosealReq" },
	 {title:"RP company registration document (copy)", state:"repIncorpHkid", require:"rpCompDocReq" },
	 {title:"RP business registration (copy)", state:"repMemoAssoc", require:"rpBusinessReq" },

	 //
	 {header:"Ship documents"},
	 {title:"Certificate of Survey", state:"survey_cert", require:"certSurveyReq" },
	 {title:"ITC for Pro-Reg only", state:"ownerAppoinRep", require:"itcProregReq" },
	 {title:"Declaration/Certification of marking", state:"noteIssue", require:"markingReq" },
	 {title:"Evidence of Deletion", state:"evidenceDeletion", require:"evidenceDeletionReq" },
	 {title:"Evidence of Deletion (Second registry)", state:"evidenceDeletion2Reg", require:"evidenceDeletion2RegReq" },
	 {title:"Certificate of Deletion", state:"deletion", require:"certDeletionReq" },
	 {title:"Certificate of Deletion (Second registry)", state:"certDeletion2Reg", require:"certDeletion2RegReq" },
	 {title:"Certification of Ownership proving encumbrance status", state:"ownerEncum", require:"ownerEncumReq" },
	 {title:"Certificate of Ownership (Second registry)", state:"certOwnership2Reg", require:"certOwnership2RegReq" },
	 {title:"Mortgagee consent for transferring to HK", state:"telexFaxMarking", require:"mortgageeConsent2RegReq" },

	 //
	 {header:"Title Documents"},
	 {title:"Builder's Certificate", state:"builderCert", require:"builderCertReq" },
	 {title:"Builder's Certificate w/ Power of attorney", state:"builderCertAttorney", require:"builderCertAttorneyReq" },
	 {title:"Builder Declaration of \"No-Seal\"", state:"builderDeclarationNoseal", require:"builderDeclNosealReq" },
	 {title:"Bill of Sale", state:"billOfSale", require:"billOfSaleReq" },
	 {title:"Bill of Sale w/ Power of attorney", state:"billOfSaleAttorney", require:"billOfSaleAttorneyReq" },
	 {title:"Seller Declaration of \"No-Seal\"", state:"sellerDeclarationNoseal", require:"sellerDeclNosealReq" },
	 {title:"Certificate of Ownership", state:"letConfIncorpCert", require:"certOwnershipReq" },
	 {title:"Court order of acquisition agreement", state:"courtOrder", require:"courtOrderReq" },
	 {title:"Delivery confirmation (i.e. Protocol of PA)", state:"noteReturn", require:"deliveryConfirmReq" },

	 //
	 {header:"Internal Documents"},
	 {title:"PRQC confirmation", state:"currTonCert", require:"prqcConfirmReq" },
	 ].forEach(addDoc);
	docFields.add({type:"button", colSpan:5, align:"left", title:"Save Document Checklist", click:function(){
		var data = this.form.getData();
		data.readCount = 0;

		var getBase64 = function (file, name, checklist) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				data["content_" + name] = reader.result;
				data.readCount = data.readCount - 1;
				if (data.readCount == 0) {
					delete data.readCount;
					data.applNo = rmForm.getData().applNo;
					applDetailDS.updateData(null, function(resp, data, req){
						setAd(data);
					}, {data:data, operation:"updateDocChecklist"});
				}
			};
			reader.onerror = function (error) {
				isc.say('Error: ', error);
			};
		}
		this.form.items.forEach(function(item) {
			if (item.name && item.name.startsWith("upload_")) {
				if (item.uploadItem && item.uploadItem.$14x.files.length > 0) {
					data["filename_" + item.name] = item.getValue();
					data.readCount = data.readCount + 1;
					getBase64(item.uploadItem.$14x.files[0], item.name, item.form);
				}
			}
		});
		var checklist = this.form;
		if (data.readCount == 0) {
			data.applNo = rmForm.getData().applNo;
			applDetailDS.updateData(null, function(resp, data, req){
				setAd(data);
			}, {data:data, operation:"updateDocChecklist"});
		}
	}});
	/*
	 */
	var checklist = isc.DynamicForm.create({numCols:4, fields:docFields});
	form.checklist = checklist;
	if (record && record.applNo) {
		applDetailDS.fetchData({applNo:record.applNo}, function(resp,data,req){
			if (data.length > 0) {
				setAd(data[0]);
			}
		});
	}

	form.getItem("docs").canvas.addChild(isc.VLayout.create({members:[checklist]}));
	form.getItem("docs").canvas.children[0].setWidth(1000);

	var loaded = function() {
		latch--;
		if (latch == 0) {
			console.log("Reg Master edit ready " + new Date());
			if (openProp && openProp.mortgageCode) {
				var data = form.mortgageGrid.getData();
				var index = data.findIndex(function(m){ return m.priorityCode == openProp.mortgageCode;});
				if (index != -1) {
					openMortgage(data[index], index, function(){ form.win.close(); });
				}
			} else if (openProp && openProp.ownerSeq) {
				var gridData = form.ownerGrid.getData();
				var seq = parseInt(openProp.ownerSeq);
				var index = gridData.findIndex(function(owner){
						return owner.ownerSeqNo == openProp.ownerSeq;
					});
//				var index = -1;
//				for (i=0; i<gridData.length; i++){
//					var oSeq = gridData[i].ownerSeqNo;
//					if (oSeq == seq){
//						index = i;
//					}
//				}
				if (index != -1) {
					openOwnerWindow(gridData[index], ownerFormFields, form.ownerGrid, index, form, mode, form.taskId);
				}
			} else if (openProp && openProp.builderCode) {
				var gridData = form.builderGrid.getData();
				var index = gridData.findIndex(function(rec){ return rec.builderCode = openProp.builderCode;});
				if (index != -1) {
					openBuilderWindow(gridData[index], builderFormFields, form.builderGrid, index, form, mode, form.taskId);
//					var actions = {};
//					var builderWf = function(operationId, bdForm, bdWin) {
//						var data = bdForm.getData();
//						data.taskId = form.taskId;
//						builderDS.updateData(null, function(resp, data, req){
//							bdWin.markForDestroy();
//							refreshInbox();
//						},{operationId:operationId, data: data});
//					};
//					if (form.todo.contains("accept")) {
//						actions["Accept"] = function(bdForm, bdWin){
//							builderWf("bmAccept", bdForm, bdWin);
//						};
//					}
//					if (form.todo.contains("approve")) {
//						actions["Approve"] = function(bdForm, bdWin){
//							builderWf("bmApprove", bdForm, bdWin);
//						};
//					}
//					if (form.todo.contains("readyCrossCheck")) {
//						actions["Ready to Cross-Check CoR"] = function(bdForm, bdWin){
//							builderWf("bmReady", bdForm, bdWin);
//						};
//					}
//					if (form.todo.contains("complete")) {
//						actions["Complete"] = function(bdForm, bdWin){
//		          			var data = bdForm.getData();
//		          			data.taskId = form.taskId;
//		          			getTransaction(function(tx) {
//		          				data.tx = tx;
//		          				builderDS.updateData(null, function(resp, data, req){
//		          					bdWin.markForDestroy();
//									refreshInbox();
//		          				},{operationId:"bmComplete", data: data});
//		      				} );
//
//						};
//					}
//					if (form.todo.contains("withdraw")) {
//						actions["Withdraw"] = function(bdForm, bdWin){
//							builderWf("bmWithdraw", bdForm, bdWin);
//						};
//					}
//					openBuilder(actions, gridData[index].applNo, gridData[index]);
				}
			}
		} else if (latch < 0) {
			console.log("latch is " + latch);
		}
	};

	classSocietyDS.fetchData({}, function(resp, data, req){
		var map = {"":""};
		data.forEach(function (d) { map[d.id] = d.id + " " + d.name;});
		form.getItem("applDetails.cs1ClassSocCode").setValueMap(map);
		loaded();
	});
	var setRep = function(rep) {
		form.representative = rep;
		form.getItem("representative.name").setValue(rep.name);
		form.getItem("representative.address1").setValue(rep.address1);
		form.getItem("representative.address2").setValue(rep.address2);
		form.getItem("representative.address3").setValue(rep.address3);
		form.getItem("representative.telNo").setValue(rep.telNo);
		form.getItem("representative.faxNo").setValue(rep.faxNo);
		form.getItem("representative.email").setValue(rep.email);
		form.getItem("representative.hkic").setValue(rep.hkic);
		form.getItem("representative.incorpCert").setValue(rep.incorpCert);
		form.getItem("representative.createdDate").setValue(rep.createdDate);
		form.getItem("representative.updatedDate").setValue(rep.updatedDate);
		form.getItem("representative.createdBy").setValue(rep.createdBy);
		form.getItem("representative.updatedBy").setValue(rep.updatedBy);
		form.getItem("representative.version").setValue(rep.version);
	};
	var setAd = function(applDetails) {
		form.applDetails = applDetails;
		if (form.checklist) {
			form.checklist.setData(applDetails);
		}
        form.getItem("applDetails.cs1ClassSocCode").setValue(applDetails.cs1ClassSocCode);
        form.getItem("applDetails.prevName").setValue(applDetails.prevName);
        form.getItem("applDetails.prevChiName").setValue(applDetails.prevChiName);
        form.getItem("applDetails.prevPort").setValue(applDetails.prevPort);
        form.getItem("applDetails.preOffNo").setValue(applDetails.preOffNo);
        form.getItem("applDetails.proposeRegDate").setValue(applDetails.proposeRegDate);
        form.getItem("applDetails.auditInsp").setValue(applDetails.auditInsp);
        form.getItem("applDetails.applDate").setValue(applDetails.applDate);
        form.getItem("applDetails.ccCountryCodePrevReg").setValue(applDetails.ccCountryCodePrevReg);
        form.getItem("applDetails.cfTime").setValue(applDetails.cfTime);
        form.getItem("applDetails.hullNo").setValue(applDetails.hullNo);
        form.getItem("applDetails.placeUponRegister").setValue(applDetails.placeUponRegister);
        form.getItem("applDetails.prevRegYear").setValue(applDetails.prevRegYear);
        form.getItem("applDetails.undertaking").setValue(applDetails.undertaking);
	};
	form.setData(record);
	var proceedTask = function(operationId, mode, tx, postAction) {
		if (form.validate()) {
			var data = form.getData();
			copyVer(form.applDetails, data.applDetails);
			data.taskId = taskId;
			data.owners = form.ownerGrid.getData();
			data.builderMakers = form.builderGrid.getData();
			data.tx = tx;
			data.reReg = (mode == 1);
			regMasterDS.updateData(data, function(resp, data, req) {
				if (!deferDestroyWin(operationId)) {
					win.markForDestroy();
				}
				refreshInbox();
				if (postAction!=null) postAction();
			}, {operationId:operationId, data:data});
		}
	};

	var deferDestroyWin = function(operationId){
//		if (operationId=="RegMasterDS_updateData_complete") {
//			return true;
//		} else {
//			return false;
//		}
		return false;
	};

	var callback = function(resp,todo,req){
		form.todo = todo;
//		addButtons("representative.actions",
//				[
//				 {showIf:function(){
//					 return mode==0
//					 	&& form.getField("regStatus").getValue()=="R";	// 20190814 only not change rp application will show this button
//				 	},
//					 title:"Amend RP<br>Detail",
//					 height:thickBtnHeight,
//					 click:function(){
//          			if (form.validate()) {
//          				var formData = form.getData()["representative"];
//          				formData.applNo = form.getField("applNo").getValue();
//          				copyVer(form.representative, formData);
//          				repDS.updateData(formData, function(resp,data,req) { setRep(data); });
//          			}
//          		}},
//          		{showIf:function(){
//          			console.log("todo"+form.todo);
//          			return mode==0	// 20190814 not change rp application
//          					&& form.getField("regStatus").getValue()=="R"	// 20190814 only registered record have this feature
//          					&& form.todo.length==0;		// 20190814 opened from ship reg list
//          			},//hasApplNo,
//          			title:"Receive<br>Change RP<br>Application",
//          			height:thickBtnHeight,
//          			click:function(){
//          			var formData = form.getData()["representative"];
//          			formData.applNo = form.getField("applNo").getValue();
//          			formData.taskId = form.taskId;
//          			repDS.updateData(formData, function(){
//          				win.markForDestroy();
//          				refreshInbox();
//          			}, {operationId:"repDS_change_receive"});
//          		}},
//          		{showIf:function(){ return mode == 4 && form.todo.contains("accept"); },
//          			title:"Accept<br>Change RP<br>Application",
//          			height:thickBtnHeight,
//          			click:function(){
//          			var formData = form.getData()["representative"];
//          			formData.applNo = form.getField("applNo").getValue();
//          			formData.taskId = form.taskId;
//          			repDS.updateData(formData, function(){
//          				win.markForDestroy();
//          				refreshInbox();
//          			}, {operationId:"repDS_change_accept"});
//          		}},
//          		{showIf:function(){ return mode == 4 && form.todo.contains("approve"); },
//          			title:"Approve<br>Change RP<br>Application",
//          			height:thickBtnHeight,
//          			click:function(){
//          			var formData = form.getData()["representative"];
//          			formData.applNo = form.getField("applNo").getValue();
//          			formData.taskId = form.taskId;
//          			repDS.updateData(formData, function(){
//          				win.markForDestroy();
//          				refreshInbox();
//          			}, {operationId:"repDS_change_approve"});
//          		}},
//          		{showIf:function(){ return mode == 4 && form.todo.contains("readyCrossCheck"); },
//          			title:"Ready to <br>Cross Check",
//          			height:thickBtnHeight,
//          			click:function(){
//              			var formData = form.getData()["representative"];
//              			formData.applNo = form.getField("applNo").getValue();
//              			formData.taskId = form.taskId;
//              			repDS.updateData(formData, function(){
//              				win.markForDestroy();
//              				refreshInbox();
//              			}, {operationId:"repDS_change_crosscheck"});
//      			}},
//          		{showIf:function(){ return mode == 4 && form.todo.contains("complete"); },
//      				title:"Complete<br>Change RP<br>Application",
//      				height:thickBtnHeight,
//      				click:function(){
//          			var formData = form.getData()["representative"];
//          			formData.applNo = form.getField("applNo").getValue();
//          			formData.taskId = form.taskId;
//          			getTransaction(function(tx) {
//          				formData.tx = tx;
//          				repDS.updateData(formData, function(){
//          					win.markForDestroy();
//          					refreshInbox();
//          				}, {operationId:"repDS_change_complete"});
//      				} );
//
//          		}},
//          		{showIf:function(){ return mode == 4 && form.todo.contains("withdraw"); },
//          			title:"Withdraw<br>Change RP<br>Application",
//          			height:thickBtnHeight,
//          			click:function(){
//          			var formData = form.getData()["representative"];
//          			formData.applNo = form.getField("applNo").getValue();
//          			formData.taskId = form.taskId;
//          			repDS.updateData(formData, function(){
//          				win.markForDestroy();
//          				refreshInbox();
//          			}, {operationId:"repDS_change_withdraw"});
//          		}},
//        		{ showIf:function(){
//        			console.log("mode" + mode);
//        			console.log("rp regstatus" + form.getField("regStatus").getValue());
//        			var bResult1 = (mode==0 || mode==4) && !form.todo.contains("complete");
//        			var bResult2 = form.getField("regStatus").getValue()!="D";
//        			console.log("bresult1:" + bResult1);
//        			console.log("bResult2:" + bResult2);
//        			return bResult1 && bResult2;
//        			},
//          			title:"Copy from <br>Company Search",
//        			height:thickBtnHeight,
//        			click:function(){
//        				console.log("copy company search");
//        				openCopyCompanySearchForm("Copy Company Search", function(record){
//        					form.getField("representative.name").setValue(record.companyName);
//        					form.getField("representative.address1").setValue("");
//        					form.getField("representative.address2").setValue("");
//        					form.getField("representative.address3").setValue("");
//        					if (record.registeredOffice.length<=80){
//        						form.getField("representative.address1").setValue(record.registeredOffice);
//        					} else if (record.registeredOffice.length<=160){
//        						form.getField("representative.address1").setValue(record.registeredOffice.substring(0,79));
//        						form.getField("representative.address2").setValue(record.registeredOffice.substring(80,record.registeredOffice.length-1));
//        					} else {
//        						form.getField("representative.address1").setValue(record.registeredOffice.substring(0,79));
//        						form.getField("representative.address2").setValue(record.registeredOffice.substring(80,159));
//        						if ( record.registeredOffice.length<=240) {
//        							form.getField("representative.address3").setValue(record.registedOffice.substring(160, record.registeredOffice.length-1));
//        						} else {
//        							form.getField("representative.address3").setValue(record.registeredOffice.substring(160,239));
//        						}
//        					}
//        				})
//        			}
//        		},
//        		{showIf:function(){
//					 //return (mode==0 || mode==4) && !form.todo.contains("complete");	// 20190814 shows button only before complete
//	        			var bResult1 = mode==4 && !form.todo.contains("complete");
//	        			var bResult2 = form.getField("regStatus").getValue()!="D";
//	        			var bResult3 = mode==0 && form.getField("regStatus").getValue()=="A";
//	        			return bResult3 || (bResult1 && bResult2);
//			 		},
//				 title:"Save RP<br>Detail",
//				 height:thickBtnHeight,
//				 click:function(){
//					 if (form.validate()) {
//						 var formData = form.getData()["representative"];
//						 formData.applNo = form.getField("applNo").getValue();
//						 copyVer(form.representative, formData);
//						 repDS.updateData(formData, function(resp,data,req) { setRep(data); });
//					 }
//				 }
//			 	}
//      		]);

		var actions=form.getItem("rm.actions").canvas.children[0];
//		20190813 actions.addMember(isc.Button.create({title:"Save1", height:thickBtnHeight, click: function() {
//   		 if (form.validate()) {
//			 var formData = form.getData()
//			 regMasterDS.updateData(formData, function(resp,rm,req) {
//					form.setData(rm);
//			});
//		 }
//		}}));
		// 20190813 actions.addMember(btnSrCheckShipName);
		if (mode==0) {	// ship registration
			if (form.todo.length==0){	// not opened from inbox
				// when applNo is null, new ship reg application
				//		SR button: receive ship reg
				//		RP button: copy company search
				//		Owner list button: add, remove, copy to RP
				//		Owner detail button: copy company search, save, close
				// when applNo is not null, old ship reg record
				//		SR button: preview CoR
				// 		when de-registered "D"
				//			RP button: none
				// 		when registered "R"
				//			RP button: receive change, amend, copy company search
				// 		when under registration "A"
				//			RP button: save, copy company search
				if (!record.applNo){	// this is new ship registration, as no applNo
					actions.addMember(btnSrReceiveApplication);
					actions.addMember(btnSrCheckShipName);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch]);
					addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					//addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				} else {				// this is have applNo
					if (form.getField("regStatus").getValue()=="R") {
						actions.addMember(btnSrPreviewCoR);
						actions.addMember(btnSrPrintCoR);
						// change rp application
						addButtons2("representative.actions",[btnRpReceiveChangeApplication, btnRpCopyFromCompanySearch, btnRpAmend]);
						// change owner detail application
						// change ownership
						addButtons2("owners.actions", [btnOwnerListNewOwnershipApplication]);
						// change builder maker
						// change injunction
						addButtons2("mortgages.actions", [btnMortgageListNewMortgageRegistration]);
					} else if (form.getField("regStatus").getValue()=="A"){
						addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
						addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
						addButtons2("builders.actions",[btnBuilderListAddBuilder]);
					} else if (form.getField("regStatus").getValue()=="D"){
						actions.addMember(btnSrPrintCoD);
					}
				}
			} else {	// opened from inbox
				if (form.todo.contains("requestAccept")) {
					actions.addMember(btnSrRequestAcceptApplication);
					actions.addMember(btnSrCheckShipName);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
					addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				}
				if (form.todo.contains("accept")) {
					actions.addMember(btnSrAssignCallSign);
					actions.addMember(btnSrAssignOfficialNumber);
					actions.addMember(btnSrAcceptApplication);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
					addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				}
				if (form.todo.contains("ready")) {
					actions.addMember(btnSrReadyApprovalApplication);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
					addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				}
				if (form.todo.contains("corReady")) {
					form.getField("regDate").setRequired(true);
					form.getField("regTime").setRequired(true);
					if (form.getField("regTime").getValue()==null) {
						form.getField("regTime").setValue("23:59");
					}
					actions.addMember(btnSrPreviewCoR);
					actions.addMember(btnSrCoRIsReady);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
					addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				}
				if (form.todo.contains("approve")) {
					actions.addMember(btnSrApproveApplication);
					addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave]);
					//addButtons2("owners.actions",[btnOwnerListAddOwner, btnOwnerListRemoveOwner, btnOwnerListCopyToRP]);
					//addButtons2("builders.actions",[btnBuilderListAddBuilder]);
				}
				if (form.todo.contains("withdraw")) {
					actions.addMember(btnSrWithdrawApplication);
				}
				if (form.todo.contains("reject")) {
					actions.addMember(btnSrRejectApplication);
				}
				if (form.todo.contains("reset")) {
					actions.addMember(btnSrResetApplication);
				}
				if (form.todo.contains("complete")) {
					actions.addMember(btnSrPrintCoR);
					actions.addMember(btnSrPrint4CoR);
					actions.addMember(btnSrCompleteApplication);
				}
			}
//		} else if (mode == 1) { // || mode == 2) {
//			if (form.todo.contains("accept")) {
//				actions.addMember(isc.Button.create({title:"Accept", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_accept_reregdereg", mode); },}));
//			}
//			if (form.todo.contains("approve")) {
//				actions.addMember(isc.Button.create({title:"Approve", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_approve_reregdereg", mode); },}));
//			}
//			if (form.todo.contains("readyCrossCheckCod")) {
//				actions.addMember(isc.Button.create({title:"Ready to <br>Cross Check", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_crossCheckReady_reregdereg", mode); },}));
//			}
//			if (form.todo.contains("complete")) {
//				actions.addMember(isc.Button.create({title:"Complete", height:thickBtnHeight, click:function(){ getTransaction(function(tx) { proceedTask("RegMasterDS_updateData_complete_reregdereg", mode, tx); } ) } }) );
//			}
//			if (form.todo.contains("withdraw")) {
//				actions.addMember(isc.Button.create({title:"Withdraw", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_withdraw_reregdereg", mode); },}));
//			}
		} else if (mode == 1 || mode==2) { // this is de-reg
			if (form.todo.contains("accept")) {
				actions.addMember(btnSrAcceptDeReReg);
				actions.addMember(btnSrWithdrawDeReReg);
			}
			if (form.todo.contains("approve")) {
				actions.addMember(btnSrApproveDeReReg);
				actions.addMember(btnSrWithdrawDeReReg);
			}
			if (form.todo.contains("readyCrossCheckCod")) {
				actions.addMember(btnSrPreviewCoD);
				actions.addMember(btnSrReadyCrossCheckCoRDeReReg);
			}
			if (form.todo.contains("complete")) {
				actions.addMember(btnSrPrintCoD);
				actions.addMember(btnSrCompleteDeReReg);
			}
			if (form.todo.contains("completeNewApp")) {
				actions.addMember(btnSrCompleteReRegNewApp);
				actions.addMember(btnSrPreviewCoR);
				actions.addMember(btnSrPrintCoR);
				addButtons2("builders.actions",[btnBuilderListAddBuilder]);
			}
		} else if (mode == 3) {	// this is change registration detail
			if (form.todo.contains("accept")) {
				//actions.addMember(isc.Button.create({title:"Accept", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_accept_changeDetails", mode); },}));
				actions.addMember(btnSrAcceptChange);
				actions.addMember(btnSrWithdrawChange);
			}
			if (form.todo.contains("approve")) {
				//actions.addMember(isc.Button.create({title:"Approve", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_approve_changeDetails", mode); },}));
				actions.addMember(btnSrPreviewCoR);
				actions.addMember(btnSrApproveChange);
				actions.addMember(btnSrWithdrawChange);
			}
			if (form.todo.contains("readyCrossCheckCod")) {
				//actions.addMember(isc.Button.create({title:"Ready to <br>Cross Check", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_crossCheckReady_changeDetails", mode); },}));
				if (form.getField("applNoSuf").getValue()=="P"){
					actions.addMember(btnSrProToFull);
				}
				actions.addMember(btnSrPreviewCoR);
				actions.addMember(btnSrReadyCrossCheckCoR);
			}
			if (form.todo.contains("complete")) {
				//actions.addMember(isc.Button.create({title:"Complete", height:thickBtnHeight, click:function(){ getTransaction(function(tx) { proceedTask("RegMasterDS_updateData_complete_changeDetails", mode, tx); } ) } }) );
				actions.addMember(btnSrPrintCoR);
				actions.addMember(btnSrCompleteChange);
			}
//			if (form.todo.contains("withdraw")) {
//				//actions.addMember(isc.Button.create({title:"Withdraw", height:thickBtnHeight, click:function(){ proceedTask("RegMasterDS_updateData_withdraw_changeDetails", mode); },}));
//				actions.addMember(btnSrWithdrawChange);
//			}
		} else if (mode == 4) {	// this is RP change application
			actions.addMember(btnSrPreviewCoR);
			actions.addMember(btnSrPrintCoR);
			if (form.todo.contains("accept")) {
				addButtons2("representative.actions",[btnRpAcceptChangeApplication, btnRpWithdrawChange]);
			}
			if (form.todo.contains("approve")) {
				addButtons2("representative.actions",[btnRpApproveChangeApplication]);
			}
//			if (form.todo.contains("withdraw")) {
//				btnRpWithdrawChange
//			}
			if (form.todo.contains("readyCrossCheck")) {
				addButtons2("representative.actions",[btnRpCopyFromCompanySearch, btnRpSave, btnRpReadyCrossCheckCoR]);
			}
			if (form.todo.contains("complete")) {
				addButtons2("representative.actions",[btnRpCompleteChange]);
			}
		} else if (mode==5){	// this is transfer/transmit ownership
			if (form.todo.contains("accept")){
				actions.addMember(btnSrPreviewCoR);
				addButtons2("owners.actions",[btnOwnerListAcceptTransferTransmit]);
			}
			if (form.todo.contains("approve")){
				actions.addMember(btnSrPreviewCoR);
				addButtons2("owners.actions",[btnOwnerListApproveTransferTransmit, btnOwnerListWithdrawTransferTransmit]);
			}
			if (form.todo.contains("readyCrossCheck")){
				actions.addMember(btnSrPreviewCoR);
				addButtons2("owners.actions",[btnOwnerListCrossCheckCoRTransferTransmit, btnOwnerListAddOwner, btnOwnerListCopyToRP]);
			}
			if (form.todo.contains("complete")){
				actions.addMember(btnSrPreviewCoR);
				actions.addMember(btnSrPrintCoR);
				addButtons2("owners.actions",[btnOwnerListCompleteTransferTransmit]);
			}
		} else if (mode == 6) { // this is owner detail change application
			actions.addMember(btnSrPreviewCoR);
			actions.addMember(btnSrPrintCoR);
		} else if (mode==7) {	// this is builder application
			actions.addMember(btnSrPreviewCoR);
			actions.addMember(btnSrPrintCoR);
		} else if (mode==8) {
			actions.addMember(btnSrPreviewCoR);
			actions.addMember(btnSrPrintCoR);
			if (form.todo.contains("acceptRegisterMortgage")) {
				addButtons2("mortgages.actions", [btnMortgageListAcceptMortgageRegistration, btnMortgageListWithdrawMortgageRegistration]);
			} else if (form.todo.contains("approveRegisterMortgage")){
				addButtons2("mortgages.actions", [btnMortgageListApproveMortgageRegistration, btnMortgageListWithdrawMortgageRegistration]);
			} else if (form.todo.contains("completeRegisterMortgage")){
				addButtons2("mortgages.actions", [btnMortgageListCompleteMortgageRegistration, btnMortgageListAddMortgage]);
			}
		} else if (mode == 0) { // it is ship reg application
			if (!record.applNo) {
				actions.addMember(btnSrReceiveApplication);
			}
			if (form.todo.contains("requestAccept")) {
				actions.addMember(btnSrRequestAcceptApplication);
				actions.addMember(btnSrCheckShipName);
			}
			if (form.todo.contains("accept")) {
				actions.addMember(btnSrAssignCallSign);
				actions.addMember(btnSrAssignOfficialNumber);
				actions.addMember(btnSrAcceptApplication);
			}
			if (form.todo.contains("ready")) {
				actions.addMember(btnSrReadyApprovalApplication);
			}
			if (form.todo.contains("corReady")) {
				form.getField("regDate").setRequired(true);
				form.getField("regTime").setRequired(true);
				if (form.getField("regTime").getValue()==null) {
					form.getField("regTime").setValue("23:59");
				}
				actions.addMember(btnSrPreviewCoR);
				actions.addMember(btnSrCoRIsReady);
			}
			if (form.todo.contains("approve")) {
				actions.addMember(btnSrApproveApplication);
			}
			if (form.todo.contains("withdraw")) {
				actions.addMember(btnSrWithdrawApplication);
			}
			if (form.todo.contains("reject")) {
				actions.addMember(btnSrRejectApplication);
			}
			if (form.todo.contains("reset")) {
				actions.addMember(btnSrResetApplication);
			}
			if (form.todo.contains("complete")) {
				actions.addMember(btnSrCompleteApplication);
			}
		}
//		} else if (mode == 4) {	// it is change ship reg detail application
//			if (form.todo.contains("complete")){
//				actions.addMember(btnSrPreviewCoR);
//				actions.addMember(btnSrPrintCoR);
//			}
//		}
		if (record.applNo && record.regStatus=="R") {
			actions.addMember(isc.Button.create({
				title:"Lock",
				height:thickBtnHeight,
				click:function(){
					var lockForm = isc.DynamicForm.create({
						fields:[
						        {name:"applNo", title:"Appl No.", value:record.applNo, type:"staticText"},
						        {name:"lockText", title:"Lock Text",
						        	valueMap:[
						        	          "Change Registration Details",
						        	          "Change Owner Details",
						        	          "Change Representative Details",
						        	          "Transfer Ownership with Mortgage",
						        	          "Transfer Ownership without Mortgage",
						        	          "Transmit Ownership",
						        	          "Register Mortgage",
						        	          "Change Mortgage Details",
						        	          "Transfer Mortgage",
						        	          "Discharge Mortgage",
						        	          "Cancel Mortgage",
						        	          ""
						        	          ]},
						        	          ]
					});
					txnLockDS.fetchData({applNo:record.applNo,},
							function(resp,data,req) {
						var members = [
						               isc.Button.create({title:"Lock", click:function(){
						            	   var lockWin = this.parentElement.parentElement.parentElement;
						            	   var data = lockForm.getData();
						            	   data.lockTime = new Date();
						            	   txnLockDS.addData(data, function() {
						            		   lockWin.markForDestroy();
						            	   });
						               }}),
						               isc.Button.create({title:"Cancel", click:function(){
						            	   this.parentElement.parentElement.parentElement.markForDestroy();
						               }}),
						               ];
						if (data.length > 0) {
							lockForm.setData(data[0]);
							members.removeAt(0);
						}
						isc.Window.create({
							title:"Lock e-Transcript",
							height:120,
							width:300,
							items:[
							       lockForm,
							       isc.ButtonsHLayout.create({
							    	   members:members}),
							    	            ]
						}).show();
					});
				}
			}));
		}
		// cross check cor start
		// 20190813 actions.addMember(btnSrPreviewCoR);
		// cross check cor end
//		20190813 if (record && record.regStatus != null) {
//			actions.addMember(btnSrPrintCoR);
//			actions.addMember(btnSrPrint4CoR);
//		}
		actions.addMember(btnSrCloseForm);
		loaded();
	};
	form.task = task;
	form.taskId = taskId;
	if (taskId) {
		taskDS.fetchData({id:taskId}, callback, {operationId:"taskDS_fetchActions"});
	} else {
		callback(null,[]);
	}
	var title = mode == 0 ? "Ship Registration" :
		mode == 1 ? "Re Registration" :
		mode == 2 ? "De Registration" :
		mode == 3 ? "Change Registration Details" :
		mode == 4 ? "Change RP Detail" :
		mode == 5 ? "Ship Registration" :
			"Ship Registration";
	var win = isc.Window.create({
		title:title,
		width:1150,
		height:680,
		items:[form],
	});
	win.show();
	form.win = win;
	__openRegMaster__ = form;

	return form;
};