package org.mardep.ssrs.domain.sr;

import java.io.Serializable;

import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = { "applNo", "builderCode", "name" })
@ToString()
public class BuilderMakerPK implements Serializable {

	private static final long serialVersionUID = 1L;

	@NonNull
	private String applNo;

	@NonNull
	private String builderCode;

	@NonNull
	private String name;

}
