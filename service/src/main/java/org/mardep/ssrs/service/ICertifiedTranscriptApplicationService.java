package org.mardep.ssrs.service;

import java.util.List;

import org.mardep.ssrs.domain.ocr.OcrEntityTranscript;
import org.mardep.ssrs.domain.sr.CertifiedTranscriptApplication;

public interface ICertifiedTranscriptApplicationService {
	List<CertifiedTranscriptApplication> getAll();
	CertifiedTranscriptApplication getById(Long id);
	void remove(int id);
	CertifiedTranscriptApplication save(CertifiedTranscriptApplication entity);
}
