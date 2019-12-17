var datasourcesList = [
	"abstractPersistentEntityDS",
	"agentDS",
	"applDetailDS",
	"authorityDS",
	"builderDS",
	"certDS",
	"certificateDS",
	"chiOffensiveWordDS",
	"classSocietyDS",
	"clinicDS",
	"companySearchDS",
	"controlDataDS",
	"countryDS",
	"courseCodeDS",
	"codeTableDS",
	"crewDS",
	"crewListCoverDS",
	"csrFormDS",
	"csrOwnerDS",
	"demandNoteBillingPersonDS",
	"demandNoteHeaderDS",
	"demandNoteItemDS",
	"demandNoteReceiptDS",
	"demandNoteRefundDS",
	"disciplinaryDS",
	"documentCheckListDS",
	"documentRemarkDS",
	"employmentDS",
	"engOffensiveWordDS",
	"feeCodeDS",
	"financeCompanyDS",
	"firstRegFeeDS",
	"funcEntitleDS",
	"dmsDataDS",
	"injuctionDS",
	"lawyerDS",
	"licenseDS",
	"medicalDS",
	"mortgageDS",
	"mortgageeDS",
	"mortgagorDS",
	"mortgageRemarkDS",
	"nationalityDS",
	"nextOfKinDS",
	"operationTypeDS",
	"ownerDS",
	"ownerEnquiryDS",
	"preReserveDS",
	"preReserveNameDS",
	"previousSerbDS",
	"provinceDS",
	"rankDS",
	"ratingDS",
	"reasonCodeDS",
	"regDS",
	"regMasterDS",
	"showDNDetailDS",
	"showDNDetailDS2",
	"registrarDS",
	"repDS",
	"roleDS",
	"sdDataDS",
	"shipManagerDS",
	"shipSubTypeDS",
	"shipTypeDS",
	"shipListDS",
	"soapMessageInDS",
	"soapMessageOutDS",
	"stopListDS",
	"seafarerDS",
	"seaServiceDS",
	"systemFuncDS",
	"systemParamDS",
	"taskDS",
	"transactionCodeDS",
	"transcriptApplicationDS",
	"transcriptApplicationDS2",
	"txnDS",
	"txnLockDS",
	"userDS",
	"userRoleDS",
	"vesselDS",
	"officeDS",
	"userGroup2DS"
//	"userGroupDS",
//"userGroupDS_user"
	];
var txCodeMap = {};
var txListCodeMap = {};


DataSource.load(datasourcesList, function(){
	var mmoJSList = [
	                 'js/code/createCodeTable.js',
	                 'js/mmo/seafarer/reg.js',
	                 'js/mmo/seafarer/medical.js',
	                 'js/mmo/seafarer/course.js',
	                 'js/mmo/seafarer/cert.js',
	                 'js/mmo/seafarer/seaService.js',
	                 'js/mmo/seafarer/employment.js',
	                 'js/mmo/seafarer/nextOfKin.js',
	                 'js/mmo/seafarer/rating.js',
	                 'js/mmo/seafarer/prevSerb.js',
	                 'js/mmo/seafarer/disciplinary.js',
	                 'js/mmo/sf_rec_details.js',
	                 'js/mmo/demandNote/adhoc_details.js',
	                 'js/mmo/crew_list_agt_details.js',
	                 'js/fin/demandNote.js'
	                 ];
		isc.FileLoader.loadJSFiles(mmoJSList);
		DMI.call("ssrsApp", "securityDMI", "checkLogin", null, loginCallback);
		transactionCodeDS.fetchData(null,
		        function (dsResponse, data) {
			for (var i = 0; i < data.length; i++) {
				txCodeMap[data[i].id] = data[i].id + " " + data[i].tcDesc;
				txListCodeMap[data[i].id] = data[i].tcDesc;
			}
			}
		);
});