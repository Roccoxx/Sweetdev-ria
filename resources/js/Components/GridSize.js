SweetDevRia.Grid.prototype.beforeResizingColumn = function (grid) {
	return function () {

		var cellIndex, column;
		cellIndex = this.getNode().cellIndex;
	    
		//column = grid.getColumnWithCellIndex(cellIndex + 1); 
		column = grid.getColumnWithCellIndex(cellIndex + 2); // NIS pour multiheader
		column = grid.getPreviousVisibleColumn(column);
		
		grid.columnResized = column;
		
		if (column.widthInPercent) {
			column.size = grid.convertToPx(column.size);
		}
		
	};
};

SweetDevRia.Grid.prototype.afterResizingColumn = function (grid) {
	return function () {
		var column = grid.columnResized;
		
		if (column && column.widthInPercent) {
			column.size = grid.convertToPercent(column.size) + "%";
		}
		
		grid.columnResized = null;
	};
};


SweetDevRia.Grid.prototype.resizingColumn = function (grid) {
	return function () {
		var column = grid.columnResized;

		//SWTRIA-1303 : code supprime lors du merge
		//SWTRIA-1160
		var newWidth = grid.getSize(this.getPreviousNode().style.width) + 1;
		//on calcule la difference et le scroll pour la derniere colonne
		var colDiff = newWidth - column.size;
		var rowWidth = SweetDevRia.DomHelper.getWidth(grid.rowsTable[0]);
		var gridWidth = grid.getGridWidth();
		
		//on resize la colonne
		column.size = newWidth;
		grid.updateColumnSize(column);

		//et on update la derniere colonne si necessaire
		if(colDiff < 0 && rowWidth > gridWidth){
			//si il y avait un scroll
			//on calcule la difference a ajouter
			var diff = Math.max(0,gridWidth - rowWidth - colDiff);
			grid.updateLastColumnSize(diff);
		}
		else{
			grid.updateLastColumnSize(-colDiff);
		}
		
		//on update les headers en cas de scroll
		grid.updateHeadDivForScroll();

	};
};


/*** Fonctions utilitaires de sizing des colonnes ***/

SweetDevRia.Grid.prototype.convertToPx = function (size) {
	if (size && size.indexOf && size.indexOf('%') !== -1) {
		return parseFloat(size.split("%")[0]) * this.getCentPercent() / 100;
	}
	else if (size && size.indexOf && size.indexOf('px') !== -1) {
		return parseFloat(size.split("px")[0], 10);
	}
	else {
		return size;
	}
};

SweetDevRia.Grid.prototype.convertToPercent = function (size) {
	if (size && size.indexOf && size.indexOf('px') !== -1) {
		return parseFloat(size.split("px")[0], 10) * 100 / this.getCentPercent();
	}
	else if (size && size.indexOf && size.indexOf('%') !== -1) {
		return parseFloat(size.split("%")[0]);
	}
	else {
		return size * 100 / this.getCentPercent();
	}
};

//SWTRIA-1117
/**
 * Fixe la hauteur de la grid et du bodyDiv en fonction de la taille
 * reelle du bodyDiv
 */
SweetDevRia.Grid.prototype.setHeightIfNotSet = function(){	
	//si la hauteur est definie, le bodyDiv a deja une hauteur fixe	
	if(!this.height){
		var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
    	var bodyHeight = SweetDevRia.DomHelper.getHeight(divBody);
    	
    	//SWTRIA-1118
    	// la hauteur de la scrollbarre n'est pas prise en compte dans getHeight() sous IE 
    	if(browser.isIE){
    		bodyHeight += SweetDevRia.DomHelper.getScrollerHeight(divBody);
    	}
    	
    	divBody.style.height = bodyHeight+"px";
    	
    	// on calcule la hauteur de la grid (pourquoi +2 ?)
    	var height = bodyHeight + this.heightHeader +2;
    	// y a t'il une toolbar d'affichee ?
    	if ( (this.pageNumber > 1) || (this.showPropertyButton)) {
    		// oui. On ajoute a la hauteur de la grid la hauteur de la toolbar
    		height += SweetDevRia.Grid.TOOLBAR_HEIGHT;
    	}    	
    	var resizable = this.resizable;
    	this.resizable = true;
    	
    	this.setHeight(height); 
    	
    	this.resizable = resizable;
    }
};


SweetDevRia.Grid.prototype.updateColumnSize = function (column, newSize) {
	var index, newSizePx, sizePx, body, length, i;

	// nouvelle taille
	newSizePx = this.getSize((newSize ? newSize : column.size));

	// on update la somme des largeurs theorique des colonnes
	// on recupere l'ancienne taille
	sizePx = this.getColumnSize(column);
	this.columnSizeSum = this.columnSizeSum - sizePx + newSizePx;

	// on met a jour la taille dans la colonne
	column.size = newSizePx;

	// on resize la colonne 
	if (this.containsData()) {
		var body = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
		var length = body.childNodes.length;
		index = this.getColumnIndex(column); // index de la cellule ds le tr

		for(var j=0;j<length;j++){
			var child = body.childNodes[j];
   			if(child.nodeName=="DIV" && !SweetDevRia.DomHelper.hasClassName(child,'ideo-ndg_groupH')){
		   		var table = child.firstChild;
    			var cell = table.firstChild.rows[0].cells[index];

    			cell.style.width = column.size + "px";
    		}
    	}
    }

	// on resize le header
	var header = SweetDevRia.DomHelper.get (this.id+"_head_col_"+column.position); 
	var headerSize = column.size - 1; // srevel : le -1 sert a compenser la col de 1px qui corrige le bug des multi headers
	
	header.style.width = headerSize + "px";
	//SWTRIA-1303 : correction faite autrement
};



SweetDevRia.Grid.prototype.updateColumnsSize = function () {
	if (! this.isInitialized){
		 return; // srevel : ca ne sert a rien de redimensionner les colonnes avant la fin de l'init car elles sont generer avec la bonne taille par le template
	}

	SweetDevRia.DomHelper.get(this.id+"_headTable").style.tableLayout = "auto";

	var lastColumn, colId;
	
	lastColumn = this.getLastVisibleColumn();

	//SWTRIA-1115
	//appel de l'ancien this.updateLastColumnSize()
	this.updateLastColumnSizeToFitGrid();

	for (colId in this.columns) {
		column = this.getColumn(colId);
		if (column.id != lastColumn.id) { // on saute la derniere colonne, elle est traitee par updateLastColumnSize
			if (column.visible) {
				this.updateColumnSize(column);
				//SWTRIA-1303 : correction faite autrement
			}
		}
	}

	SweetDevRia.DomHelper.get(this.id+"_headTable").style.tableLayout = "fixed";
	
};



SweetDevRia.Grid.prototype.beforeResizing = function () {
	this.updateSizeSum();
};

SweetDevRia.Grid.prototype.afterResizing = function () {
	this.updateSizeSum();
};


SweetDevRia.Grid.prototype.updateSizeSum = function () {
	var j, sum, colId, column;	
	j = 0;
	sum = 0;
	
	if (this.displayCheckbox) {
		sum += this.checkboxColWidth;
	}
	
	for (colId in this.columns) {
		column = this.getColumn(colId);
		if (!column.visible) {
			continue;
		}
		
		sum += this.getColumnSize(column);
		j = j + 1;

		if (j >= this.visibleColumnNumber) {
			break;
		}
	}
	
	this.columnSizeSum = sum;
};

//SWTRIA-1115
/**
 * Fait apparaitre/disapraitre le dissimulateur place en haut a droite
 * de la grid en fonction de l'apparition/disparition de la barre de scroll verticale.
 * Ne touche pas a la taille des colonnes
 */
SweetDevRia.Grid.prototype.updateHeadDivForScroll = function () {
			
	if (this.containsData()) {
		var divBody = SweetDevRia.DomHelper.get(this.id + '_bodyDiv');
		var width = SweetDevRia.DomHelper.getWidth (divBody); 
		var scrollerWidth = SweetDevRia.DomHelper.getScrollerWidth(divBody);
		
		var hasScroll = (scrollerWidth > 0);
		modifScroll =  (this.hasScroll != hasScroll);
		this.hasScroll = hasScroll;	
		
		if(modifScroll && hasScroll){
			//si la barre de scroll horizontale est apparue sur le bodyDiv
			//on fixe la largeur visible du headDiv afin de synchroniser le scroll
			var headDiv = SweetDevRia.DomHelper.get(this.id + '_headDiv');
			headDiv.style.width = width + "px";
			//et on fait apparaitre le dissimulateur de scroll
			var headSDTable = SweetDevRia.DomHelper.get(this.id + '_headSDTable');
			if(!headSDTable.style.width){
				headSDTable.style.width = scrollerWidth + "px";
			}
			var headScrollDissembler = SweetDevRia.DomHelper.get(this.id + '_headScrollDissembler');
			headScrollDissembler.style.display = "block";
		}
		else if(modifScroll && !hasScroll){
			//sinon on retabli la largeur a 100%
			var divHeader = SweetDevRia.DomHelper.get(this.id + '_headDiv');
			divHeader.style.width = "100%";
			//et on cache le dissimulateur
			var headScrollDissembler = SweetDevRia.DomHelper.get(this.id + '_headScrollDissembler');
			headScrollDissembler.style.display = "none";
		}
		else if(hasScroll){
			//si la barre de scroll etait deja la
			//on resize le headDiv a la largeur du bodyDiv
			var headDiv = SweetDevRia.DomHelper.get(this.id + '_headDiv');
			headDiv.style.width = width + "px";
		}
	}
};

//SWTRIA-1115
/**
 * Met a jour la taille du header et des cellules de la derniere colonne
 * en lui ajoutant la valeur de diff qui peut etre negative
 * @param diff (int) la difference a ajouter a la largeur de la derniere colonne
 * @param headerDone (boolean) precise s'il faut egalement resizer le header
 */
SweetDevRia.Grid.prototype.updateLastColumnSize = function (diff, headerDone) {
	
	//si il faut effectivement mettre a jour
	if(this.containsData() && diff != 0){
		// on recupere la derniere colonne
		var	column = this.getLastVisibleColumn();
		// sa largeur theorique (fixee dans la jsp ou par resize de colonne)
		var	thSize = this.getColumnSize(column);
		// la largeur du colgroup associe
		var colGroup = this.getColInColgroup(column.position);
		var colGroupSize = colGroup.style.width;
		
		// et sa largeur reelle
		//var realSize = SweetDevRia.DomHelper.getWidth(this.id + '_head_col_' + column.position);
		var realSize = this.getSize(colGroupSize) + 1;
		
		var newSize= realSize + diff;
		// la largeur theorique est la taille minimum 
		if(newSize < thSize){
			newSize = thSize;
		}
		else if(headerDone){
			newSize = thSize + diff;
		}
		
		// resize du header
		if(!headerDone){
			colGroup.style.width = (newSize-1) + "px";
		}
		
		// on resize la colonne
		var body = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
		var length = body.childNodes.length;
		var index = this.getColumnIndex(column);

		for(var j=0;j<length;j++){
			var child = body.childNodes[j];
    		if(child.nodeName=="DIV" && !SweetDevRia.DomHelper.hasClassName(child,'ideo-ndg_groupH')){
		   		var table = child.firstChild;
    			var cell = table.firstChild.rows[0].cells[index];
	   			cell.style.width = newSize + "px";
    		}
    	}
	}
};

//SWTRIA-1115
/**
 * Met a jour la taille des cellules de la derniere colonne
 * pour qu'elle corresponde a la taille actuelle du header
 */
SweetDevRia.Grid.prototype.updateLastColumnSizeToHeaderSize = function(){
	var lastColumn = this.getLastVisibleColumn();
	var colGroup = this.getColInColgroup(lastColumn.position);
	var diff = this.getSize(colGroup.style.width) - lastColumn.size + 1;
	this.updateLastColumnSize(diff,true);
};

//SWTRIA-1115
/**
 * Met a jour le header d'une colonne à la taille donnee,
 * ou a la taille theorique de la colonne si newSize n'est pas defini
 */
SweetDevRia.Grid.prototype.updateColumnHeaderSize = function(column, newSize){
	
	// nouvelle taille
	newSizePx = this.getSize((newSize ? newSize : column.size)) - 1;
	
	var colGroup = this.getColInColgroup(column.position);
	colGroup.style.width = newSizePx + "px";
};

//SWTRIA-1115
// renommage de la fonction updateLastColumnSize,
// le contenu de cette methode me parait suspect
// mais elle fonctionne dans le cas du resize ou du drag&drop de colonnes
SweetDevRia.Grid.prototype.updateLastColumnSizeToFitGrid = function () {
	var column, index, width, newSize, scrollerWidth, divBody, body, length, i;

	// on calcule la taille de la grid
	width = SweetDevRia.DomHelper.getWidth (this.id + '_bodyDiv'); 

	// on met a jour la somme des largeurs theorique des colonnes visibles
	this.updateSizeSum();

	// on calcule la taille,s'il y a, de la barre de scrolling verticale
	//  car il faut prendre en compte sa largeur (environ 17px) dans le calcul
	scrollerWidth = 0;
	var modifScroll = false;
	if (this.containsData()) {
		divBody = SweetDevRia.DomHelper.get(this.id + '_bodyDiv');
		scrollerWidth = divBody.scrollWidth-divBody.offsetWidth;
		
		var hasScroll = (scrollerWidth > 0);
		modifScroll =  (this.hasScroll != hasScroll);
		this.hasScroll = hasScroll;
	}
	
	
	// S'il la somme des colonnes est inferieure a la taille de la grid :
	// Il faut compenser la taille de la derniere colonne 
	if (this.columnSizeSum <= width || modifScroll) {
		// on recupere la derniere colonne
		column = this.getLastVisibleColumn();
		// on recup sa taille
		newSize = this.getColumnSize(column);

		// on calcule la nouvelle taille de la derniere colonne
		var spliterSize = (this.visibleColumnNumber - 1) * SweetDevRia.Grid.SPLITER_SIZE;
		if (this.displayCheckbox) {
			spliterSize += SweetDevRia.Grid.SPLITER_SIZE +  1;
		}
		
		if (this.columnSizeSum <= width) { // si la taille de la grid est plus grande que la somme des colonnes, on agrangit la derniere colonne
			// nouvelle taille = taille de la grid - taille theorique des colonnes - taille des splitter - largeur de la scrollbar verticale
			newSize = width - this.getFixedSizeSum() - spliterSize - scrollerWidth;
		}
		else {
			// on met a jour la taille de la colonne en fonction de la largeur du la scrollbar
			newSize = newSize - scrollerWidth;
		}

		//SWTRIA-1206 : code supprime

		// on resize la colonne
		if (this.containsData()) {
			var body = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
			length = body.childNodes.length;
			index = this.getColumnIndex(column);

			for(var j=0;j<length;j++){
				var child = body.childNodes[j];
	    		if(child.nodeName=="DIV" && !SweetDevRia.DomHelper.hasClassName(child,'ideo-ndg_groupH')){
			   		var table = child.firstChild;
	    			var cell = table.firstChild.rows[0].cells[index];
		   			cell.style.width = newSize + "px";
	    		}
	    	}
	    }
	
		// resize du header
		var col = this.getColInColgroup (column.position);
		//SWTRIA-1202
		// le header doit avoir 1px en moins que les cellules de la colonne
		col.style.width = (newSize - 1 + scrollerWidth) + "px";
	}
};

//SWTRIA-1206
/**
 * Met a jour la largeur group headers. Si width n'est pas defini,
 * on utilise la largeur de la ligne de headers.
 * @param width la nouvelle largeur. 
 */
SweetDevRia.Grid.prototype.updateGroupHeadersSize = function (width) {
	if (this.groupBy && this.groupingDataDescr) {
		if(!width){
			width = SweetDevRia.DomHelper.getWidth(this.tableHead);
		}
		for (var blocDescrIndex = 0; blocDescrIndex < this.groupingDataDescr.length; blocDescrIndex++) {
			var groupHeader = SweetDevRia.DomHelper.get(this.id+'_groupHeader_'+blocDescrIndex);
			groupHeader.style.width = this.getSize(width)+"px";
		}
	}
}

/**
 * Retourne index de la colonne en fonction de sa position
 * @param column colonne dont on cherche l'index dans le tag tr
 * @return index de la colonne en fonction de sa position
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnIndex = function (column) {
	// decalage si necessaire de l index de la colonne, du a l affichage
	// des checkbox
	var index = 2 * column.position; // RAG
	if (this.displayCheckbox) {
		index += 2;
	}
	
	return index;
};

SweetDevRia.Grid.prototype.getFixedSizeSum = function () {
	var lastColumn, j, sum, sumPx, column, colId;	
	lastColumn = this.getLastVisibleColumn();
	j = 0;
	sum = 0;
	sumPx = 0;
	
	for (colId in this.columns) {
		column = this.getColumn(colId);
		if (column.id === lastColumn.id) {
			continue;
		}
		
		if (column.visible) {
			if (column.size && column.size.indexOf && column.size.indexOf('%') !== -1) {
				sum += parseFloat(column.size.split("%")[0]);
			}
			else if (column.size && column.size.indexOf && column.size.indexOf('px') !== -1) {
				sumPx += parseFloat(column.size.split("px")[0]);
			}
			else {
				sumPx += parseInt(column.size, 10);
			}
			j = j + 1;
		}
		
		if (j >= this.visibleColumnNumber) {
			break;
		}
	}
	
	if (this.displayCheckbox) {
		sumPx += this.checkboxColWidth;
	}
	
	return this.getSize(sum + "%") + sumPx;
};

/**
 * Return the column size 
 * @param {Column} column The column of which you want the size
 * @return the column size
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnSize = function (column) {
	var size = this.getSize(column.size);
	
	//SWTRIA-1348
	if(column.widthInPercent){
		//si ce n'est pas la derniere colonne il faut prendre en compte le spliter
		if(column != this.getLastColumn()){
			size -=2;
		}
		//le pourcentage ne sert que lors du premier calcul
		column.size = size;
		column.widthInPercent = false;
	}
	
	return size;
};

//Can't use convert function due to specific controls
SweetDevRia.Grid.prototype.getSize = function (size) {
	if (size && size.indexOf && size.indexOf('%') !== -1) {
		var px = parseFloat(size.split("%")[0]) * this.getCentPercent() / 100;
		//SWTRIA-1202
		//0% ne doit pas rendre 1px
		if(px == 0)return 0;
		//SWTRIA-1348
		//il faut arrondir
		return (px >= 1 ? Math.round(px) : 1);
	}
	else if (size && size.indexOf && size.indexOf('px') !== -1) {
		return parseInt(size.split("px")[0], 10);
	}
	else {
		return parseInt(size, 10);
	}	
};

SweetDevRia.Grid.prototype.getGridWidth = function () {
	if (this.width && this.width.indexOf && this.width.indexOf('%') !== -1) {
		return parseInt(this.width.split("%")[0], 10) * this.getCentPercent() / 100;
	}
	else if (this.width && this.width.indexOf && this.width.indexOf('px') !== -1) {
		return parseInt(this.width.split("px")[0], 10);
	}
	else {
		return this.width;
	}
};

