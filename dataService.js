window.dataService = new ( function() {
	let _self = this;
	let _serventData = [];
	let _materialData = [];
	
	
	_self.init = function () {
		console.log('init dataService');
		
		_self.initServentData();
		_self.initMaterialData();
		
	} 
	
	_self.initServent = function () {
		let skillData = [];
		let ascensionData = [];
		let cnNameData = [];
		
		$.getJSON( "data/data-skill.json", function( dataS ) {
			skillData = dataS;
			
			$.getJSON( "data/data-ascension.json", function( dataA ) {
				ascensionData = dataA;
				
				$.getJSON( "data/data-chinese-name.json", function( dataC ) {
					cnNameData = dataC;
				
					_self.combineServentData(skillData, ascensionData, cnNameData);
				})
			})
		})
	}
	
	_self.combineServentData = function (skillData, ascensionData, cnNameData) {
		let tempServentData = [];
		
		$.each( skillData, function(index , servent) {
			servent.svtCnName = cnNameData[ index ].name;
			servent.rare = ascensionData[servent.id].rare;
			servent.cls = ascensionData[servent.id].cls;
			servent.ascension = ascensionData[servent.id].ascension;
			
			tempServentData[tempServentData.length] = servent;
		} )
		
		_serventData = tempServentData;
		console.log(_serventData);
	}

	
	_self.init();
})();