window.mainComponent = new ( function() {
	let _self = this;
	let $servantCardTemplate;
	let $servantListIconTemplate;
	let $servantGroupIconTemplate;
	let servantMap = {};
	
	_self.init = function () {
		$servantCardTemplate = $('.servant-card').remove();
		_self.setEvent();
	} 

	_self.setEvent = function () {
		$('.add-servant-icon').click(function() {
			_self.initServantClassList();
			_self.initServantList();
		})
		
		$('#servantListModal .add-servants-btn').click(function() {
			_self.addMultipleServants();
			$('#servantListModal .btn-secondary').click();
		})
		
	}
	
	_self.initServantList = function() {
		if($servantListIconTemplate == null) {
			$servantListIconTemplate = $('#servantListModal .modal-body').find('.servant-img-choose').remove();
		}
		
		$('#servantListModal .modal-body').empty();
		
		$.each(window.dataService.getServantList(), function(index, servant) {
			$servantIcon = $servantListIconTemplate.clone();
			
			$servantIcon.appendTo('#servantListModal .modal-body');
			$servantIcon.find('img').attr('src', servant.imgSrc);
			$servantIcon.addClass('servant-' + servant.cls.toLowerCase().replace(/\s/g, ''));
			$servantIcon.attr('servantIndex', index);
			
			if(servant.rare != 'B') {
				$servantIcon.click(function() {
					$(this).toggleClass('img-select');
				})
			}
		})	
	}
	
	_self.initServantClassList = function() {
		if($servantGroupIconTemplate == null) {
			$servantGroupIconTemplate = $('#servantListModal .servant-group-list').find('.servant-group-icon').remove();
		}
		
		$('#servantListModal .servant-group-list').empty();
		
		$.each(window.dataService.getClassList(), function(index, svClass) {
			$classIcon = $servantGroupIconTemplate.clone();
	
			$classIcon.appendTo('#servantListModal .servant-group-list');
			$classIcon.find('img').attr('src', svClass.imgSrc);
			$classIcon.attr('servantGroupClass', '.servant-' + svClass.enName.toLowerCase().replace(/\s/g, ''));
			$classIcon.attr('servantGroupId', svClass.id);
			
			$classIcon.click(function() {
				$('.servant-group-icon').removeClass('group-select');
				$(this).addClass('group-select');
				
				if($(this).attr('servantGroupId') == 0) {
					$(".servant-img-choose").show();
				}
				else {
					$(".servant-img-choose").hide();
					$($(this).attr('servantGroupClass')).show();
				}
			})
			
			if(svClass.id == 0){
				$classIcon.addClass('group-select');
			}
		})
	}
	
	_self.addMultipleServants = function() {
		$('#servantListModal .modal-body .img-select').each(function() {
			let newServant = new ServantCardClass(
				$servantCardTemplate.clone(), 
				_self.uuidv4(), 
				window.dataService.getServantData( $(this).attr("servantIndex") )
			);
		
			servantMap[newServant.getUuid()] = newServant;
		})
	}
	
	
	_self.removeServant = function(servantCardUuid) {
		if(servantMap[servantCardUuid] != null) {
			servantMap[servantCardUuid].getInterface().remove();
			delete servantMap[servantCardUuid];
		}
		
		_self.recalculateTotalMaterial();
	}
	
	_self.recalculateTotalMaterial = function() {
		let tempTotalData = {};
		
		$.each(servantMap, function(key, servantCard) {
			let servantTotal = servantCard.getMaterialStorage();
			
			// ascension
			$.each(servantTotal.ascension.totalMaterial, function(mName, mCount) {
				if(tempTotalData[mName] == null ) {
					tempTotalData[mName] = mCount;
				}
				else {
					tempTotalData[mName] += mCount;
				}
			})
			
			//skill
			
		});
		
		// display total
		$('.total-material').empty();
		
		$.each(tempTotalData, function(mName, mCount) {
			let colBlocks = (mName == 'QP') ? 12 : 2;
			
			let $mDiv = $( "<div class='col-" + colBlocks + " total-material-block'></div>" )
			let material = window.dataService.getMaterialData(mName);
			
			$mDiv.html(`<img class='material-icon' src='${material.imgSrc}'><div>${mCount}</div>`);
			
			$('.total-material').append($mDiv);
		})
	}
	
	
	_self.uuidv4 = function() {
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	}
	
	_self.init();
})();