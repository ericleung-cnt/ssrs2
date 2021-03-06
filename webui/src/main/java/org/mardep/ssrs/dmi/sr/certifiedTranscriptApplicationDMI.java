package org.mardep.ssrs.dmi.sr;

import java.util.List;

import org.mardep.ssrs.dao.ocr.IOcrTranscriptDao;
import org.mardep.ssrs.dao.sr.ICertifiedTranscriptApplicationDao;
import org.mardep.ssrs.dmi.codetable.AbstractCodeTableDMI;
import org.mardep.ssrs.domain.codetable.FinanceCompany;
import org.mardep.ssrs.domain.codetable.Office;
import org.mardep.ssrs.domain.dn.DemandNoteItem;
import org.mardep.ssrs.domain.sr.CertifiedTranscriptApplication;
import org.mardep.ssrs.service.ICertifiedTranscriptApplicationService;
import org.mardep.ssrs.service.ITranscriptApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;

@Component
public class certifiedTranscriptApplicationDMI extends AbstractCodeTableDMI<CertifiedTranscriptApplication>{

	//@Autowired
	//IOcrTranscriptDao transcriptDao;
	
	@Autowired
	//ITranscriptApplicationService svc;
	//ICertifiedTranscriptApplicationDao svc;
	ICertifiedTranscriptApplicationService svc;
	
	public DSResponse fetch(CertifiedTranscriptApplication entity, DSRequest dsRequest) {
		//return super.fetch(entity, dsRequest);
		DSResponse dsResponse = new DSResponse();
		dsResponse.setStatus(DSResponse.STATUS_SUCCESS);
		List<CertifiedTranscriptApplication> list = getAll();
		dsResponse.setData(list);
		return dsResponse;
	}
	
	public List<CertifiedTranscriptApplication> getAll() {
		//return transcriptDao.getAll();
		return svc.getAll();
	}
		
	public DSResponse remove(CertifiedTranscriptApplication entity) {
		//transcriptDao.remove(entity.getOcrTranscriptId());
		// 2019.08.09 svc.remove(entity.getOcrTranscriptId());
		DSResponse dsResponse = new DSResponse();
		CertifiedTranscriptApplication transcript = svc.getById(entity.getId());
		if (transcript!=null) {
			//transcript.setProcessed("Y");
			svc.save(transcript);
			dsResponse.setStatus(DSResponse.STATUS_SUCCESS);
		} else {
			dsResponse.setStatus(DSResponse.STATUS_FAILURE);			
		}
		
		return dsResponse; 
	}
	
	@Override
	public DSResponse update(CertifiedTranscriptApplication entity, DSRequest dsRequest) throws Exception {
		return super.update(entity, dsRequest);
	}
	
	@Override
	public DSResponse add(CertifiedTranscriptApplication entity, DSRequest dsRequest) throws Exception {
		return super.add(entity, dsRequest);
	}
}
