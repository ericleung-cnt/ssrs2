package org.mardep.ssrs.report.generator;

import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.mardep.dns.common.DemandNote;
import org.mardep.ssrs.dao.codetable.IFeeCodeDao;
import org.mardep.ssrs.dao.codetable.ISystemParamDao;
import org.mardep.ssrs.dao.dn.IDemandNoteHeaderDao;
import org.mardep.ssrs.dao.dn.IDemandNoteItemDao;
import org.mardep.ssrs.domain.codetable.FeeCode;
import org.mardep.ssrs.domain.codetable.SystemParam;
import org.mardep.ssrs.domain.constant.Cons;
import org.mardep.ssrs.domain.dn.DemandNoteHeader;
import org.mardep.ssrs.domain.dn.DemandNoteItem;
import org.mardep.ssrs.report.IDemandNoteGenerator;
import org.mardep.ssrs.service.IJasperReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//@Service("dnSsrsGenerator")
@Service("demandNoteGenerator")
@Transactional
public class DnSsrsGenerator extends AbstractReportGenerator implements IDemandNoteGenerator{

	private static final String dnsDateFormat = "yyyy-MM-dd";

	protected final static String PRINT_COPY_CAPTION = "printCopyCaption";

	protected final Logger logger = LoggerFactory.getLogger(getClass());

	private final String FIELD_ISSUING_SECTION_ENG = "issuingSectionEng";
	private final String FIELD_ISSUING_SECTION_CHI = "issuingSectionChi";
	private final String FIELD_ENQUIRE_TEL = "enquireTel";
	private final String FIELD_DEPT_REF = "deptRef";

	private final String FIELD_SHIP_NAME_CHI = "shipNameChi";
	private final String FIELD_SHIP_NAME_ENG = "shipNameEng";
	private final String FIELD_GROSS_TON = "grossTon";
	private final String FIELD_NET_TON = "netTon";

	private final String FIELD_DN_NUMBER = "dnNumber";
	private final String FIELD_ISSUE_DATE = "issueDate";
	private final String FIELD_DUE_DATE = "dueDate";
	private final String FIELD_DN_AMT = "dnAmt";
	private final String FIELD_BILL_NAME = "billName";
	private final String FIELD_CO_NAME = "coName";
	private final String FIELD_ADDR1 = "addr1";
	private final String FIELD_ADDR2 = "addr2";
	private final String FIELD_ADDR3 = "addr3";

	private final String FIELD_DN_REMARKS = "dnRemarks";

	private final String FIELD_REMINDER_MSG = "reminderMsg";
	private final String FIELD_REMINDER_DATE = "reminderDate";

	private final String PARAM_SUBREPORT_1 = "SUBREPORT_1";
	private final String PARAM_ITEM_LIST = "itemList";
	private final String PARAM_DN_AMT = "dnAmt";
	private final String PARAM_LOGO = "logoLarge300";
	private final String PARAM_QRCODE = "qrCode";
	private final String PARAM_DNSR = "bDNSR";

//	private final String MMO_DN_PREFIX = "0516";
	private final String SR_DN_PREFIX = "0517";

	private final String SR_ENQUIRY_TEL = "SR_ENQUIRY_TEL";
	private final String MMO_ENQUIRY_TEL = "MMO_ENQUIRY_TEL";

	@Autowired
	IDemandNoteHeaderDao demandNoteHeaderDao;

	@Autowired
	IDemandNoteItemDao demandNoteItemDao;

	@Autowired
	IFeeCodeDao feeCodeDao;

	@Autowired
	ISystemParamDao systemParamDao;

	@Autowired
	IJasperReportService jasperReportService;

	@Override
	public byte[] generate(String demandNoteId) throws Exception {
		return this.generate(demandNoteId, false);
	}

	@Override
	public byte[] generate(String demandNoteNo, boolean autopay) throws Exception {
		return generate(demandNoteNo, autopay, null);
	}

	@Override
	public byte[] generate(String demandNoteNo, boolean autopay, Boolean firstReminder) throws Exception {
		Map<String, Object> inputParam = new HashMap<String, Object>();
		inputParam.put("demandNoteNo", demandNoteNo);
		inputParam.put("autopay", autopay);
		if (firstReminder != null) {
			if (firstReminder) {
				inputParam.put("print1stReminder", Boolean.TRUE);
			} else {
				inputParam.put("print2ndReminder", Boolean.TRUE);
			}
		}
		return generate(inputParam);
	}

	@Override
	public byte[] generate(Map<String, Object> inputParam) throws Exception {
		String demandNoteNo = (String)inputParam.get("demandNoteNo");
		//inputParam.put("autopay", true);
		//inputParam.put("printCopyCaption", true);
		List<Map<String, Object>> dnItemList = new ArrayList<Map<String, Object>>();

		DemandNoteHeader dnHeader = demandNoteHeaderDao.findById(demandNoteNo);
		List<DemandNoteItem> demandNoteItemList = demandNoteItemDao.findByDemandNoteNo(demandNoteNo);
		if(dnHeader==null) return null;

		for (DemandNoteItem item:demandNoteItemList) {
			FeeCode feeCode = feeCodeDao.findById(item.getFcFeeCode());
			Map<String, Object> feeItem = new HashMap<String, Object>();
			feeItem.put("feeItemChi", feeCode.getChiDesc());
			feeItem.put("feeItemEng", feeCode.getEngDesc());
			item.setFeeCode(feeCode);
			if (!dnHeader.getDemandNoteNo().startsWith(SR_DN_PREFIX)) {
				feeItem.put("chargedUnits",
						item.getChargedUnits()!=null
						? Integer.toString(item.getChargedUnits())
						: "");
				//record.amount/record.chargedUnits
				if (item.getAmount()!=null && item.getChargedUnits()!=null) {
					BigDecimal unitPrice = item.getAmount().divide(BigDecimal.valueOf(item.getChargedUnits()),2,RoundingMode.CEILING);
					feeItem.put("unitPrice", "@ " + String.format("%,.2f", unitPrice.setScale(2, RoundingMode.CEILING)));
				} else {
					feeItem.put("unitPrice", "");
				}
			} else {
				feeItem.put("chargedUnits", "");
				feeItem.put("unitPrice", "");
			}
			feeItem.put("feeAmt",
					item.getAmount()!=null
					? String.format("%,.2f", item.getAmount().setScale(2, RoundingMode.CEILING))
					: "");
			dnItemList.add(feeItem);
		}

		Map<String, Object> params = createParamsMap(demandNoteNo, dnHeader, dnItemList, demandNoteItemList, inputParam);

		Map<String, Object> fieldMap = createFieldMap(dnHeader, inputParam);

		return jasperReportService.generateReport(getReportFileName(), Arrays.asList(fieldMap), params);
	}

	private Map<String, Object> createFieldMap(DemandNoteHeader dnHeader, Map<String, Object> inputParam) {
		SimpleDateFormat sdf = new SimpleDateFormat(dnsDateFormat);

		Map<String, Object> fieldMap = new HashMap<String, Object>();

		fieldMap.put(FIELD_SHIP_NAME_CHI, dnHeader.getShipNameChi() != null ? dnHeader.getShipNameChi() : "");
		fieldMap.put(FIELD_SHIP_NAME_ENG, dnHeader.getShipNameEng() !=null ? dnHeader.getShipNameEng() : "");
		fieldMap.put(FIELD_GROSS_TON,
				dnHeader.getGrossTon()!=null
				? String.format("%,.2f", dnHeader.getGrossTon().setScale(2, RoundingMode.CEILING))
				: "");
		fieldMap.put(FIELD_NET_TON,
				dnHeader.getNetTon()!=null
				? String.format("%,.2f", dnHeader.getNetTon().setScale(2, RoundingMode.CEILING))
				: "");
		fieldMap.put(FIELD_DN_NUMBER, dnHeader.getDemandNoteNo());
		fieldMap.put(FIELD_ISSUE_DATE, sdf.format(dnHeader.getGenerationTime()));
		fieldMap.put(FIELD_DUE_DATE, sdf.format(dnHeader.getDueDate()));
		//BigDecimal amt = dnHeader.getAmount();
		fieldMap.put(FIELD_DN_AMT,
				dnHeader.getAmount()!=null
				? String.format("%,.2f", dnHeader.getAmount().setScale(2, RoundingMode.CEILING))
				: "");
		fieldMap.put(FIELD_BILL_NAME, dnHeader.getBillName());
		fieldMap.put(FIELD_CO_NAME,
				dnHeader.getCoName()!=null ? dnHeader.getCoName() : "");
		fieldMap.put(FIELD_ADDR1,
				dnHeader.getAddress1()!=null ? dnHeader.getAddress1() : "");
		fieldMap.put(FIELD_ADDR2,
				dnHeader.getAddress2()!=null ? dnHeader.getAddress2() : "");
		fieldMap.put(FIELD_ADDR3,
				dnHeader.getAddress3()!=null ? dnHeader.getAddress3() : "");

		String enquiryTel;
		if (dnHeader.getDemandNoteNo().startsWith(SR_DN_PREFIX)) {
			fieldMap.put(FIELD_ISSUING_SECTION_ENG,"Hong Kong Shipping Registry");
			fieldMap.put(FIELD_ISSUING_SECTION_CHI, "船舶註冊處");
			SystemParam sysParam = systemParamDao.findById(SR_ENQUIRY_TEL);
			enquiryTel = sysParam.getValue();
			fieldMap.put(FIELD_DEPT_REF, "HKSR 605/"+dnHeader.getApplNo());
		} else {
			fieldMap.put(FIELD_ISSUING_SECTION_ENG, "Mercantile Marine Office");
			fieldMap.put(FIELD_ISSUING_SECTION_CHI, "商船海員管理處");
			SystemParam sysParam = systemParamDao.findById(MMO_ENQUIRY_TEL);
			enquiryTel = sysParam.getValue();
			fieldMap.put(FIELD_DEPT_REF, "MMO - " + Integer.toString(Calendar.getInstance().get(Calendar.YEAR)));
		}
		fieldMap.put(FIELD_ENQUIRE_TEL, enquiryTel!=null ? enquiryTel : "");

	    if (Boolean.TRUE.equals(inputParam.get("autopay"))) {
	    	fieldMap.put(FIELD_DN_REMARKS, "** PAYMENT WILL BE SETTLED BY EBS AUTOPAY **");
	    } else {
	    	fieldMap.put(FIELD_DN_REMARKS, "");
	    }

    	fieldMap.put(FIELD_REMINDER_MSG, "");
    	fieldMap.put(FIELD_REMINDER_DATE, "");
	    if (Boolean.TRUE.equals(inputParam.get("print1stReminder"))) {
	    	//if (dnHeader.getFirstReminderDate()!=null) {
	    		fieldMap.put(FIELD_REMINDER_MSG, "1st Reminder");
	    		fieldMap.put(FIELD_REMINDER_DATE, dnHeader.getFirstReminderDateStr());
	    	//}
	    }

	    if (Boolean.TRUE.equals(inputParam.get("print2ndReminder"))) {
	    	//if (dnHeader.getSecondReminderDate()!=null) {
	    		fieldMap.put(FIELD_REMINDER_MSG, "2nd Reminder");
	    		fieldMap.put(FIELD_REMINDER_DATE, dnHeader.getSecondReminderDateStr());
	    	//}
	    }

	    return fieldMap;
	}

	private Map<String, Object> createParamsMap(String demandNoteNo, DemandNoteHeader dnHeader, List<Map<String, Object>> dnItemList,
			List<DemandNoteItem> demandNoteItemList, Map<String, Object> inputParam) throws Exception {
		Map<String, Object> params = new HashMap<String, Object>();
		//params.put("dnNumber", demandNoteNo);
		params.put(PARAM_SUBREPORT_1, jasperReportService.getJasperReport("DN_Subreport.jrxml"));
		//params.put("demandNote", dnHeader);
		params.put(PARAM_ITEM_LIST, dnItemList);
		params.put(PARAM_DN_AMT,
				dnHeader.getAmount()!=null
				? String.format("%,.2f", dnHeader.getAmount().setScale(2, RoundingMode.DOWN))
				: "");
		//params.put("logo", DnSrGenerator.class.getResource("/images/MDLogo.png"));
		params.put(PARAM_QRCODE,
				createQRCode(dnHeader.getDemandNoteNo(), dnHeader.getAmount(), demandNoteItemList));
		//params.put("logoLarge72", DnSrGenerator.class.getResource("/images/LOGO_MD_Large_72dpi.png"));
		params.put(PARAM_LOGO, DnSsrsGenerator.class.getResource("/images/LOGO_MD_Large_300dpi.png"));
		//params.put("logoMedium72", DnSrGenerator.class.getResource("/images/LOGO_MD_Medium_72dpi.png"));
		//params.put("logoMedium300", DnSrGenerator.class.getResource("/images/LOGO_MD_Medium_300dpi.png"));
		//params.put("logoSmall72", DnSrGenerator.class.getResource("/images/LOGO_MD_Small_72dpi.png"));
		//params.put("logoSmall300", DnSrGenerator.class.getResource("/images/LOGO_MD_small_300dpi.png"));
		//String prefix = demandNoteNo.substring(0,3);
		//String prefix1 = demandNoteNo.substring(0, 4);
		if (demandNoteNo.startsWith(SR_DN_PREFIX)){
			params.put(PARAM_DNSR, "Y");
		} else {
			params.put(PARAM_DNSR, "N");
		}

	    if (Boolean.TRUE.equals(inputParam.get("printCopyCaption"))) {
	    	//params.put("watermark", DnSsrsGenerator.class.getResource("/images/copy.jpg"));
	    	params.put("copyLogo", "COPY");
	    } else {
	    	params.put("copyLogo", "");
	    }

	    return params;
	}

	@Override
	public String getReportFileName() {
		// TODO Auto-generated method stub
		//return null;
		return "DN_SSRS.jrxml";
	}

	protected InputStream createQRCode(String dnNo, BigDecimal totalAmount, List<DemandNoteItem> demandNoteItemList) throws Exception{
		Map<String, Double> revenueItem = new HashMap<String, Double>();
		revenueItem.put(demandNoteItemList.get(0).getFeeCode().getFormCode(), totalAmount.doubleValue());
		SimpleDateFormat df = new SimpleDateFormat(dnsDateFormat, Locale.ENGLISH);
		InputStream qrCode = DemandNote.getDemandNoteQR(dnNo, Cons.DNS_BILL_CODE, dnNo.substring(2, 4), df.format(new Date()), totalAmount.doubleValue(), revenueItem, 100);
		//return IOUtils.toByteArray(qrCode);
		return qrCode;
	}

}
