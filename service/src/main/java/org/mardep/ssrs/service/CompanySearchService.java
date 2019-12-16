package org.mardep.ssrs.service;

import java.util.List;

import javax.transaction.Transactional;

import org.mardep.ssrs.dao.ocr.IOcrCompanySearchDao;
import org.mardep.ssrs.domain.ocr.OcrEntityCompanySearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CompanySearchService implements ICompanySearchService {

	@Autowired
	IOcrCompanySearchDao companySearchDao;
	
	@Override
	public List<OcrEntityCompanySearch> getAll() {
		// TODO Auto-generated method stub
		return companySearchDao.getAll();
	}

}
