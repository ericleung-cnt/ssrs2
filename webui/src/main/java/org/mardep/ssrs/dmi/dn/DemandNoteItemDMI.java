package org.mardep.ssrs.dmi.dn;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mardep.ssrs.dmi.AbstractDMI;
import org.mardep.ssrs.domain.dn.DemandNoteItem;
import org.mardep.ssrs.service.IBaseService;
import org.mardep.ssrs.service.IDemandNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;

@Component
public class DemandNoteItemDMI extends AbstractDMI<DemandNoteItem>{

	private static final String FETCH_SR_ONLY = "demandNoteItemDS_fetchSrOnly";
	private static final Object FETCH_UNUSED_BY_APPL_NO = "demandNoteItemDS_unused";
	@Autowired
	IDemandNoteService demandNoteService;

	@Override
	protected IBaseService getBaseService(){
		return demandNoteService;
	}

	@Override
	public DSResponse fetch(DemandNoteItem entity, DSRequest dsRequest){
		String operationId = dsRequest.getOperationId();
		DSResponse dsResponse = new DSResponse();
		if (FETCH_SR_ONLY.equals(dsRequest.getOperationId())) {
			List<DemandNoteItem> items = demandNoteService.findSrDnItems();
			items.forEach(i->{
				i.setFeeCode(null);
				i.setDemandNoteHeader(null);
			});
			return new DSResponse(items, DSResponse.STATUS_SUCCESS);
		} else if (FETCH_UNUSED_BY_APPL_NO.equals(dsRequest.getOperationId())) {
			List<DemandNoteItem> items = demandNoteService.findUnusedByAppl(entity.getApplNo());
			items.forEach(i->{
				i.setFeeCode(null);
				i.setDemandNoteHeader(null);
			});
			return new DSResponse(items, DSResponse.STATUS_SUCCESS);
		} else if ("SEARCH_DEMAND_NOTE_NO".equals(operationId)) {
			List<DemandNoteItem> result = new ArrayList<DemandNoteItem>();
			result = demandNoteService.searchDemandNoteNo(entity.getApplNo());
			//dsResponse.setTotalRows(1);
			dsResponse.setData(result);
			return dsResponse;
		}else{
			return super.fetch(entity, dsRequest);
		}
	}

	@Override
	public DSResponse update(DemandNoteItem entity, DSRequest dsRequest) {
		// TODO
		return null;
	}

	@Override
	public DSResponse remove(DemandNoteItem entity, DSRequest dsRequest) {
		String operationId = dsRequest.getOperationId();
		if ("demandNoteItemDS_removeSrItem".equals(operationId)) {
			Map data = dsRequest.getClientSuppliedValues();
			String reason = (String) data.get("reason");
			Long id = (Long) data.get("id");
			if (id != null) {
				demandNoteService.removeItem(id, reason);
			}
			return new DSResponse();
		} else {
			DSResponse dsResponse = new DSResponse();
			dsResponse.setStatus(DSResponse.STATUS_SUCCESS);
			return dsResponse;
		}
	}

	@Override
	public DSResponse add(DemandNoteItem entity, DSRequest dsRequest) {
		String operationId = dsRequest.getOperationId();
		DSResponse dsResponse = new DSResponse();
		dsResponse.setStatus(DSResponse.STATUS_SUCCESS);
		try {
			if(DemandNoteOperationId.ADD_DEMAND_NOTE_ITEM.equals(operationId)){
				DemandNoteItem updateItem = demandNoteService.addItem(entity);
				dsResponse.setTotalRows(1);
				dsResponse.setData(updateItem);
			}
			return dsResponse;
		} catch (Exception ex){
			logger.error("Fail to add-{}, Exception-{}", new Object[]{entity, ex}, ex);
			return handleException(dsResponse, ex);
		}

//		return super.add(entity, dsRequest);
	}

}
