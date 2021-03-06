package org.mardep.ssrs.dms.ocr.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.mardep.ssrs.dms.ocr.xml.OcrXmlEng2;
import org.mardep.ssrs.dms.ocr.xml.OcrXmlEng2_Seafarer;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

@Service
public class OcrServiceEng2 implements IOcrServiceEng2 {

	private final String XML_TAG_ENG2 = "_List_of_Crew:_List_of_Crew";
	
	private String extractXmlStringValue(Node node) {
		if (node.getChildNodes().getLength()>0) {
			String value = node.getChildNodes().item(0).getNodeValue(); // extractXmlStringValue(firstDocElement, "_Name_of_Ship");
			if (value!=null) {
				return value;
			} else {
				return "";
			}
		}else {
			return "";
		}
	}

	@Override
	public OcrXmlEng2 getEntityFromOcr(String xmlFile) {
		// TODO Auto-generated method stub
		try {
			DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder;			
			Document doc;
			
			docBuilder = docBuilderFactory.newDocumentBuilder();
			doc = docBuilder.parse(new File(xmlFile));
		
			doc.getDocumentElement().normalize();
			//SimpleDateFormat formatter = new SimpleDateFormat("yyyy-mm-dd");

			// tagname checking
			if (doc.getElementsByTagName(XML_TAG_ENG2)
					.getLength()==0) {
				return null;
			}

			NodeList listOfDocs = doc
					.getElementsByTagName(XML_TAG_ENG2)
					.item(0)
					.getChildNodes();
			OcrXmlEng2 entity = new OcrXmlEng2();
			entity.setSeafarerList(createSeafarerList());
			
			System.out.println("list of docs length: " + listOfDocs.getLength());
			for (int s = 0; s < listOfDocs.getLength(); s++) {
				Node firstDocNode = listOfDocs.item(s);
				if (firstDocNode.getNodeType() == Node.ELEMENT_NODE) {
					Element firstDocElement = (Element) firstDocNode;
					
					System.out.println("Node: " + firstDocNode.getNodeName());
					String tagValue = extractXmlStringValue(firstDocNode);
					switch (firstDocNode.getNodeName()) {
						case "_Name_of_Ship":
							entity.setShipName(tagValue);
							break;
						case "_IMO_number":
							entity.setImoNumber(tagValue);
							break;
						case "_Date_of_commencement":
							entity.setDateOfCommencement(tagValue);
							break;
						case "_Ref_No_1":
							entity.getSeafarerList().get(0).setRefNo(tagValue);
							break;
						case "_Name_of_Seafarer_1":
							entity.getSeafarerList().get(0).setSeafarerName(tagValue);
							break;
						case "_SERB_1":
							entity.getSeafarerList().get(0).setSerb(tagValue);
							break;
						case "_Date_of_Birth_1":
							entity.getSeafarerList().get(0).setDateOfBirth(tagValue);
							break;
						case "_Gender_1":
							entity.getSeafarerList().get(0).setGender(tagValue.replace(" ", ""));
							break;
						case "_Nationality_1":
							entity.getSeafarerList().get(0).setNationality(tagValue);
							break;
						case "_Place_of_Birth_1":
							entity.getSeafarerList().get(0).setPlaceofBirth(tagValue);
							break;
						case "_Address_of_Seafarer1_1":
							entity.getSeafarerList().get(0).setAddress1(tagValue);
							break;
						case "_Address_of_Seafarer2_1":
							entity.getSeafarerList().get(0).setAddress2(tagValue);
							break;
						case "_Name_of_Next_of_Kin_1":
							entity.getSeafarerList().get(0).setNextOfKin(tagValue);
							break;
						case "_Relationship_of_Next_of_Kin_1":
							entity.getSeafarerList().get(0).setRelationship(tagValue);
							break;
						case "_Capacity_1":
							entity.getSeafarerList().get(0).setCapacity(tagValue);
							break;
						case "_Particulars_of_Certificate_1":
							entity.getSeafarerList().get(0).setCert(tagValue);
							break;
						case "_Amount_of_wages_1":
							entity.getSeafarerList().get(0).setWages(tagValue);
							break;
						case "_Date_and_Place_of_Engagement1_1":
							entity.getSeafarerList().get(0).setDateOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_Engagement2_1":
							entity.getSeafarerList().get(0).setPlaceOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_discharge1_1":
							entity.getSeafarerList().get(0).setDateOfDischarge(tagValue);
							break;
						case "_Date_and_Place_of_discharge2_1":
							entity.getSeafarerList().get(0).setPlaceOfDischarge(tagValue);
							break;
						case "_Ref_No_2":
							entity.getSeafarerList().get(1).setRefNo(tagValue);
							break;
						case "_Name_of_Seafarer_2":
							entity.getSeafarerList().get(1).setSeafarerName(tagValue);
							break;
						case "_SERB_2":
							entity.getSeafarerList().get(1).setSerb(tagValue);
							break;
						case "_Date_of_Birth_2":
							entity.getSeafarerList().get(1).setDateOfBirth(tagValue);
							break;
						case "_Gender_2":
							entity.getSeafarerList().get(1).setGender(tagValue.replace(" ", ""));
							break;
						case "_Nationality_2":
							entity.getSeafarerList().get(1).setNationality(tagValue);
							break;
						case "_Place_of_Birth_2":
							entity.getSeafarerList().get(1).setPlaceofBirth(tagValue);
							break;
						case "_Address_of_Seafarer1_2":
							entity.getSeafarerList().get(1).setAddress1(tagValue);
							break;
						case "_Address_of_Seafarer2_2":
							entity.getSeafarerList().get(1).setAddress2(tagValue);
							break;
						case "_Name_of_Next_of_Kin_2":
							entity.getSeafarerList().get(1).setNextOfKin(tagValue);
							break;
						case "_Relationship_of_Next_of_Kin_2":
							entity.getSeafarerList().get(1).setRelationship(tagValue);
							break;
						case "_Capacity_2":
							entity.getSeafarerList().get(1).setCapacity(tagValue);
							break;
						case "_Particulars_of_Certificate_2":
							entity.getSeafarerList().get(1).setCert(tagValue);
							break;
						case "_Amount_of_wages_2":
							entity.getSeafarerList().get(1).setWages(tagValue);
							break;
						case "_Date_and_Place_of_Engagement1_2":
							entity.getSeafarerList().get(1).setDateOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_Engagement2_2":
							entity.getSeafarerList().get(1).setPlaceOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_discharge1_2":
							entity.getSeafarerList().get(1).setDateOfDischarge(tagValue);
							break;
						case "_Date_and_Place_of_discharge2_2":
							entity.getSeafarerList().get(1).setPlaceOfDischarge(tagValue);
							break;
						case "_Ref_No_3":
							entity.getSeafarerList().get(2).setRefNo(tagValue);
							break;
						case "_Name_of_Seafarer_3":
							entity.getSeafarerList().get(2).setSeafarerName(tagValue);
							break;
						case "_SERB_3":
							entity.getSeafarerList().get(2).setSerb(tagValue);
							break;
						case "_Date_of_Birth_3":
							entity.getSeafarerList().get(2).setDateOfBirth(tagValue);
							break;
						case "_Gender_3":
							entity.getSeafarerList().get(2).setGender(tagValue.replace(" ", ""));
							break;
						case "_Nationality_3":
							entity.getSeafarerList().get(2).setNationality(tagValue);
							break;
						case "_Place_of_Birth_3":
							entity.getSeafarerList().get(2).setPlaceofBirth(tagValue);
							break;
						case "_Address_of_Seafarer1_3":
							entity.getSeafarerList().get(2).setAddress1(tagValue);
							break;
						case "_Address_of_Seafarer2_3":
							entity.getSeafarerList().get(2).setAddress2(tagValue);
							break;
						case "_Name_of_Next_of_Kin_3":
							entity.getSeafarerList().get(2).setNextOfKin(tagValue);
							break;
						case "_Relationship_of_Next_of_Kin_3":
							entity.getSeafarerList().get(2).setRelationship(tagValue);
							break;
						case "_Capacity_3":
							entity.getSeafarerList().get(2).setCapacity(tagValue);
							break;
						case "_Particulars_of_Certificate_3":
							entity.getSeafarerList().get(2).setCert(tagValue);
							break;
						case "_Amount_of_wages_3":
							entity.getSeafarerList().get(2).setWages(tagValue);
							break;
						case "_Date_and_Place_of_Engagement1_3":
							entity.getSeafarerList().get(2).setDateOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_Engagement2_3":
							entity.getSeafarerList().get(2).setPlaceOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_discharge1_3":
							entity.getSeafarerList().get(2).setDateOfDischarge(tagValue);
							break;
						case "_Date_and_Place_of_discharge2_3":
							entity.getSeafarerList().get(2).setPlaceOfDischarge(tagValue);
							break;
						case "_Ref_No_4":
							entity.getSeafarerList().get(3).setRefNo(tagValue);
							break;
						case "_Name_of_Seafarer_4":
							entity.getSeafarerList().get(3).setSeafarerName(tagValue);
							break;
						case "_SERB_4":
							entity.getSeafarerList().get(3).setSerb(tagValue);
							break;
						case "_Date_of_Birth_4":
							entity.getSeafarerList().get(3).setDateOfBirth(tagValue);
							break;
						case "_Gender_4":
							entity.getSeafarerList().get(3).setGender(tagValue.replace(" ", ""));
							break;
						case "_Nationality_4":
							entity.getSeafarerList().get(3).setNationality(tagValue);
							break;
						case "_Place_of_Birth_4":
							entity.getSeafarerList().get(3).setPlaceofBirth(tagValue);
							break;
						case "_Address_of_Seafarer1_4":
							entity.getSeafarerList().get(3).setAddress1(tagValue);
							break;
						case "_Address_of_Seafarer2_4":
							entity.getSeafarerList().get(3).setAddress2(tagValue);
							break;
						case "_Name_of_Next_of_Kin_4":
							entity.getSeafarerList().get(3).setNextOfKin(tagValue);
							break;
						case "_Relationship_of_Next_of_Kin_4":
							entity.getSeafarerList().get(3).setRelationship(tagValue);
							break;
						case "_Capacity_4":
							entity.getSeafarerList().get(3).setCapacity(tagValue);
							break;
						case "_Particulars_of_Certificate_4":
							entity.getSeafarerList().get(3).setCert(tagValue);
							break;
						case "_Amount_of_wages_4":
							entity.getSeafarerList().get(3).setWages(tagValue);
							break;
						case "_Date_and_Place_of_Engagement1_4":
							entity.getSeafarerList().get(3).setDateOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_Engagement2_4":
							entity.getSeafarerList().get(3).setPlaceOfEngagement(tagValue);
							break;
						case "_Date_and_Place_of_discharge1_4":
							entity.getSeafarerList().get(3).setDateOfDischarge(tagValue);
							break;
						case "_Date_and_Place_of_discharge2_4":
							entity.getSeafarerList().get(3).setPlaceOfDischarge(tagValue);
							break;
					}
				}
			}
			return entity;
		} catch (ParserConfigurationException e) {
		// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
		// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
		// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	private List<OcrXmlEng2_Seafarer> createSeafarerList(){
		List<OcrXmlEng2_Seafarer> seafarerList = new ArrayList<OcrXmlEng2_Seafarer>();
		for (int i=0; i<4; i++) {
			OcrXmlEng2_Seafarer seafarer = new OcrXmlEng2_Seafarer();
			seafarerList.add(seafarer);
		}
		return seafarerList;
	}
	
	@Override
	public void uploadToDMS(String imageFile, OcrXmlEng2 entity) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void saveEntityToSSRS(OcrXmlEng2 entity) {
		// TODO Auto-generated method stub
		System.out.println("ship name: " + entity.getShipName());
		System.out.println("imo number: " + entity.getImoNumber());
		System.out.println("date of commencement: " + entity.getDateOfCommencement());
		List<OcrXmlEng2_Seafarer> seafarerList = entity.getSeafarerList();
		if (seafarerList.size()>0) {
			for (OcrXmlEng2_Seafarer item : seafarerList) {
				System.out.println("ref no: " + item.getRefNo());
				System.out.println("seafarerName " + item.getRefNo() + ": " + item.getSeafarerName());
				System.out.println("serb " + item.getRefNo() + ": "  + item.getSerb());
				System.out.println("date of birth " + item.getRefNo() + ": " + item.getDateOfBirth());
				System.out.println("gender " + item.getRefNo() + ": " + item.getGender());
				System.out.println("nationality " + item.getRefNo() + ": "  + item.getNationality());
				System.out.println("place of birth " + item.getRefNo() + ": " + item.getPlaceofBirth());
				System.out.println("address 1" + item.getRefNo() + ": " + item.getAddress1());
				System.out.println("address 2 " + item.getRefNo() + ": " + item.getAddress2());
				System.out.println("next of kin " + item.getRefNo() + ": " + item.getNextOfKin());
				System.out.println("relationship " + item.getRefNo() + ": " + item.getRelationship());
				System.out.println("capacity " + item.getRefNo() + ": " + item.getCapacity());
				System.out.println("cert " + item.getRefNo() + ": " + item.getCert());
				System.out.println("wages " + item.getRefNo() + ": " + item.getWages());
				System.out.println("date and place of engagement " + item.getRefNo() + ": " + item.getDateOfEngagement());
				System.out.println("place of engagement " + item.getRefNo() + ": " + item.getPlaceOfEngagement());
				System.out.println("date and place of discharge " + item.getRefNo() + ": " + item.getDateOfDischarge());
				System.out.println("place of discharge " + item.getRefNo() + ": " + item.getPlaceOfDischarge());
			}
		}
	}

}
