window.dataService = new ( function() {
	let _self = this;
	let _servantData = [];
	let _materialData = [];
	let _classData = [];
	
	_self.init = function () {
		console.log('init dataService');
		
		_self.initServantData();
		_self.initMaterialData();
		
	} 
	
	_self.initServantData = function () {
		
		$.when(
			$.getJSON( "data/data-skill.json"), 
			$.getJSON( "data/data-ascension.json"), 
			$.getJSON( "data/data-chinese-name.json"),
			$.getJSON( "data/data-class.json")
		)
		.done( function (skillResp, ascensionResp, cnNameResp, classResp) {
			_self.combineServantData(skillResp[0], ascensionResp[0], cnNameResp[0], _self.initClassData(classResp[0]));
			console.log('load data success');
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			console.log('load data error');
		});
		
	}
	
	_self.initClassData = function (classData) {
		let nameMap = {};
		_classData = classData;
		
		$.each(classData, function(index, svClass) {
			svClass.imgSrc = "images/class_" + svClass.id + ".png";
			nameMap[svClass.name] = svClass;
		})
		
		return nameMap;
	}
	
	_self.getClassList = function() {
		return _classData;
	}
	
	_self.combineServantData = function (skillData, ascensionData, cnNameData, classMap) {
		let tempServantData = [];

		$.each( skillData, function(index , servant) {
			servant.svtCnName = cnNameData[ index ].name;
			
			if( ascensionData["svt_" + servant.id] != null ) {
				servant.rare = ascensionData["svt_" + servant.id].rare;
				servant.cls = classMap[ascensionData["svt_" + servant.id].cls].enName;
				servant.ascension = _self.ascensionObjectToArray( ascensionData["svt_" + servant.id].ascension );
				servant.imgSrc = "images/svtNo_" + servant.id + ".png"; 
			}
			else {
				servant.rare = "B";
				servant.cls = "None";
				servant.ascension = [];
				servant.imgSrc = "images/btn_close.png";				
			}
			
			tempServantData[tempServantData.length] = servant;
		} )
		
		_servantData = tempServantData;
		console.log(_servantData);
	}
	
	_self.ascensionObjectToArray = function(ascensionArr) {
		let tempArr = [];
		
		$.each(ascensionArr, function(index, ascension) {
			let tempSingleArr = []
			
			$.each(ascension, function(key, value) {
				tempSingleArr[tempSingleArr.length] = {
					"name" : key,
					"cnt" : value
				}
			})
			
			tempArr[index] = tempSingleArr;
		})
		
		return tempArr;
	}
	
	_self.getServantData = function( index ) {
		return _servantData[index];
	}
	
	_self.getServantList = function() {
		return _servantData;
	}
	
	_self.initMaterialData = function () {
		$.getJSON( "data/data-item-img-id.json", function( data ) {
			let tempMaterialData = {};
			
			$.each( data, function(key, value) {
				let tempObj = {};
				tempObj.id = value;
				tempObj.imgSrc = "images/S_" + value + ".png";
			
				tempMaterialData[key] = tempObj;
			})
			
			_materialData = tempMaterialData;
			console.log(_materialData);
		})
	}
	
	_self.getMaterialData = function( mName ) {
		return _materialData[mName]
	}

	
	_self.init();
})();