createCodeTable2(clinicDS, [
	{name: "id"},
	{name: "name"},
	{name: "chiName"},
	{name: "adds1"},
	{name: "adds2"},
	{name: "adds3"},
	{name: "chiAdds1"},
	{name: "chiAdds2"},
	{name: "chiAdds3"},
	{name: "applyDate"},
	{name: "cancelDate"},
	{name: "tel"},
	{name: "email"},
	{name: "noq"},
	{name: "year"},
	{name: "regNo"},
	{name: "recognizedIndicator"}
],
[
	{name: "id", type:"staticText", endRow: true},
	{name: "name", width: "200", type:"text"},
	{name: "chiName", width: "200", type:"text", endRow: true},
	{name: "adds1", width: "600", colSpan: 5, type:"text"},
	{name: "adds2", width: "600", colSpan: 5, type:"text"},
	{name: "adds3", width: "600", colSpan: 5, type:"text"},
	{name: "chiAdds1", width: "600", colSpan: 5, type:"text"},
	{name: "chiAdds2", width: "600", colSpan: 5, type:"text"},
	{name: "chiAdds3", width: "600", colSpan: 5, type:"text", endRow: true},
	{name: "applyDate", type:"date"},
	{name: "deleteDate", type:"date", endRow:true},
	{name: "tel"},
	{name: "email", endRow: true},
	{name: "noq", width:"300", length:200, type:"textArea" },
	{name: "year", width:"100",length:100, type:"textArea"},
	{name: "regNo", type:"text", startRow:true},
	{name: "recognizedIndicator", type:"text"}
],["id"], 'paged');