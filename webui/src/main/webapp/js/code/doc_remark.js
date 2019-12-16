createCodeTable2(documentRemarkDS, 
	[
		{ name: "id"}, 
		{ name: "remarkGroup"},
		{ name: "remark"}
	],
	[
		 { name: "id", required: true},
		 { name: "remarkGroup", startRow:true},
		 { name: "remark", length:100, type:"textArea", startRow:true, colSpan:3, width:"*" }
	],
	["id"]);