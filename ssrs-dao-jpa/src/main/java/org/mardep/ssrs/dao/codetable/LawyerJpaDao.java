package org.mardep.ssrs.dao.codetable;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Root;

import org.mardep.ssrs.dao.AbstractJpaDao;
import org.mardep.ssrs.dao.PredicateCriteria;
import org.mardep.ssrs.dao.PredicateCriteria.PredicateType;
import org.mardep.ssrs.domain.codetable.Lawyer;
import org.springframework.stereotype.Repository;

@Repository
public class LawyerJpaDao extends AbstractJpaDao<Lawyer, String> implements ILawyerDao {

	@Override
	protected List<PredicateCriteria> resolvePredicateCriteriaList(final CriteriaBuilder cb, final Root<Lawyer> listRoot) {
		List<PredicateCriteria> list = new ArrayList<PredicateCriteria>();
		list.add(new PredicateCriteria("id", PredicateType.EQUAL));
		list.add(new PredicateCriteria("name1", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("name2", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("address1", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("address2", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("address3", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("telNo", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("faxNo", PredicateType.LIKE_IGNORE_CASE));
		list.add(new PredicateCriteria("email", PredicateType.LIKE_IGNORE_CASE));

		return list;
	}
}
