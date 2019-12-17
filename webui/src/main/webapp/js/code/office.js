createCodeTable2(officeDS, 
	[
		{ name: "id"}, 
		{ name:"code",width:70},
		{ name: "name",width:250,showHover:true},
		{ name: "status",width:70},
		{ name: "tel",width:180},
		{ name: "email",width:180},
		{ name: "address1",width:300},
		{ name: "address2",width:300},
		{ name: "address3",width:300}
	],
	[
		{ name:"code",width:70},
		{ name: "name",width:300,colspan:2},
		{ name: "status", width:100},
		{ name: "tel",width:180,startRow:true},
		{ name: "email",width:180},
		{ name: "address1",startRow:true,colSpan:3,width:500},
		{ name: "address2",startRow:true,colSpan:3,width:500},
		{ name: "address3",startRow:true,colSpan:3,width:500}
	],
	["id"]);