package org.mardep.ssrs.service;

import java.util.Date;
import java.util.List;

import org.mardep.ssrs.domain.codetable.Crew;
import org.mardep.ssrs.domain.seafarer.PreviousSerb;
import org.mardep.ssrs.domain.seafarer.Reg;
import org.mardep.ssrs.domain.seafarer.Seafarer;

/**
 * 
 * @author Leo.LIANG
 *
 */
public interface ISeafarerService extends IBaseService{

	/**
	 * 
	 * <li>PRG-MMO-003
	 * 
	 * "Create Seafarer registration record
	 * Default values:
	 * Record Number = Max(Record Number) + 1
	 * Mandatory fields:
	 * Record Date
	 * Validate fields:"
	 * 
	 * @param reg
	 * @return
	 */
	public Reg renew(Reg reg);
	
	/**
	 * <li>PRG-MMO-004
	 * 
	 * @param seafarerId
	 * @param newSerbNo
	 * @return
	 */
	public PreviousSerb reIssueSerb(String seafarerId, String newSerbNo, Date newSerbDate);
	/**
	 * 
	 * <li>PRG-MMO-004
	 * </br>
	 *  <b>Logic:</b>
	 * </br> Create previous SERB record
	 *	Default values:
	 *  current SERB number in Seafarer record
	 *  current reg date in Seafarer record
	 *	Mandatory fields:
	 *	Validate fields:"
	 * 
	 * </br>
	 * @return
	 */
	public PreviousSerb reIssueSerb(Seafarer currentSeafarer);
	
	public Crew add(Crew crew);
	
	public List<Crew> getByVesselIdCoverYymm(String vesselId, String coverYymm); 
}
