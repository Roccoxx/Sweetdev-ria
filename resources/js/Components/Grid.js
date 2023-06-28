/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006 - 2010] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software	
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *
 *
 *        web : http://www.ideotechnologies.com
 *        email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * @version 3.5.2.1
 * @author Ideo Technologies
 */

 /**
	 * This is the Grid component class
	 * 
	 * @param {String}
	 *            id Id of this table
	 * @constructor
	 * @extends RiaComponent
	 * @base RiaComponent
	 */

SweetDevRia.Grid = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Grid");

	this.columns = {};
	this.columnsAtPosition = new Array();
	
	this.columnNumber = 0;
	this.visibleColumnNumber = 0;
	
	this.width = null;
	this.columnSizeSum = 0; // Sum of column's width
	this.centPercent = 0;
	this.toRecalculate = true;
	this.toCalculate = false;
	
	this.checkboxColWidth = 30; 
	this.minColumnWidth = 30;
	
	this.draggableColumns = true; 
	
	this.defaultRowSize = 300; // Default row size for special added columns

	this.resizable = true;

	this.selectionMode = SweetDevRia.Grid.prototype.NO_SELECTION;
	this.selection = null;
	
	this.rowSelectorType = SweetDevRia.Grid.prototype.ROW_SELECTOR_CHECKBOX; // SWTRIA-1305
	
	this.displayCheckbox = false;
	this.checkedRows = [];
	this.checkedGroupRows = [];
	
	this.lastSelectionAdded = null;  // Last row or cell added to selection
										// (by key, click or API)
	
	this.groupingDataDescr = null;

	this.rowPerPage = 10;
	this.actualPage = 1;
	this.pageNumber = 1;

	this.totalDataNumber = 6;

	this.innerExportId = null;

	this.heightHeader = 0;
	this.heightRow = null;
	this.height = null;
	
	this.adjustedColumnId = null;
	
	this.isInitialized = false;
	
	// Liste de MenuItem personnalisee
	this.listMenuItems = [];
	
	this.sortPropertiesDeep = 3;
	this.groupingPropertiesDeep = 3;
	
	/**
	 * Ids
	 */
	this.headPrefix = this.id+"_"+SweetDevRia.Grid.HEAD_COLUMN;
	this.spliterPrefix = this.id+"_"+SweetDevRia.Grid.HEAD_COLUMN_SPLITER;
	this.headBeforePrefix = this.id+"_"+SweetDevRia.Grid.HEAD_COLUMN_BEFORE;
	this.ddArrowId = this.id+"_"+SweetDevRia.Grid.DD_ARROW;
	this.theadId = this.id+"_"+SweetDevRia.Grid.THEAD;
	this.tbodyId = this.id+"_"+SweetDevRia.Grid.TBODY;

	// SWTRIA-1303
	this.topToolBarId = this.id+"_"+SweetDevRia.Grid.TOOLBAR+"_top";
	this.bottomToolBarId = this.id+"_"+SweetDevRia.Grid.TOOLBAR+"_bottom";
	// SWTRIA-1306
	this.topPageBarId = this.id+"_"+SweetDevRia.Grid.PAGEBAR+"_top";
	this.bottomPageBarId = this.id+"_"+SweetDevRia.Grid.PAGEBAR+"_bottom";
	this.pageBarIds = [this.topPageBarId, this.bottomPageBarId];
	this.showTopPageBarIfNeeded = false;
	this.topBarVisible = false;		
	this.bottomBarVisible = true;	
	
	this.sortPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.SORT_PROPERTIES;
	this.groupingPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.GROUPING_PROPERTIES;
	this.excelPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.EXCEL_PROPERTIES;
	this.gridPropertiesWindowId = this.id+"_"+SweetDevRia.Grid.GRID_PROPERTIES;
	
	
	/**
	 * accessors
	 */	
	this.tableBody = null;
	this.tableHead = null;
	this.spliters = [];
	this.headerDDs = {};
	this.ddArrow = null;
	
	this.groupBy = null;
	this.groupedData = {};
	this.data = [];
	
	this.renderNode = null;
	this.isTreeGrid = false;
	this.treeModelId = null;
	
	this.minHeight = 0;
	this.maxHeight = null;
	this.minWidth = 0;
	this.maxWidth = null;

	this.editable = false;
	
	this.constraintId = null;
	
    this.groups = {}; // contient les group de headers
    this.maxGroupDepth = 0; // contient le nombre de ligne de header
    this.hasHeaderGroup = false; // true si il existe des group de header

    // loading rows state
    this.rowsLoaded = false;
    this.rowsLoading = false;
    this.initializedData = null;
    
    this.canChangeItemPerPage = true;  // SWTRIA-1307
    this.showTotalPageNumber = true;	// SWTRIA-1308
    this.pageBarMode = SweetDevRia.Grid.NORMAL_PAGINATION_MODE; // SWTRIA-1309
};
extendsClass (SweetDevRia.Grid, SweetDevRia.RiaComponent);


/**
 * Constants
 */


/**
 * This constant indicate that row selector is checkbox SWTRIA-1305
 * 
 * @type int
 */
SweetDevRia.Grid.ROW_SELECTOR_CHECKBOX = 0;

/**
 * This constant indicate that row selector is radio button SWTRIA-1305
 * 
 * @type int
 */
SweetDevRia.Grid.ROW_SELECTOR_RADIO = 1;


/**
 * This constant indicate that no selection is possible in this table.
 * 
 * @type int
 */
SweetDevRia.Grid.NO_SELECTION = 0;

/**
 * This constant indicate that the user can select only one row at once.
 * 
 * @type int
 */
SweetDevRia.Grid.ROW_SELECTION = 1;

/**
 * This constant indicate that the user can select many rows.
 * 
 * @type int
 */
SweetDevRia.Grid.ROWS_SELECTION = 2;

/**
 * This constant indicate that the user can select only one cell at once.
 * 
 * @type int
 */
SweetDevRia.Grid.CELL_SELECTION = 3;

/**
 * This constant indicate that the user can select many cells.
 * 
 * @type int
 */
SweetDevRia.Grid.CELLS_SELECTION = 4;

/**
 * This constant indicate that the excel export will contain data like display
 * at the screen (hidden columns, order, etc...).
 * 
 * @type int
 */
SweetDevRia.Grid.WYSIWYG_EXPORT = 1;

/**
 * This constant indicate that the excel export will contain all data included
 * in server model.
 * 
 * @type int
 */
SweetDevRia.Grid.MODEL_EXPORT = 2;



SweetDevRia.Grid.HEAD = "head";
SweetDevRia.Grid.THEAD = "thead";
SweetDevRia.Grid.BODY = "body";
SweetDevRia.Grid.TBODY = "tbody";
SweetDevRia.Grid.FOOT = "foot";
SweetDevRia.Grid.TFOOT = "tfoot";
SweetDevRia.Grid.HEAD_COLUMN = "headColumn";
SweetDevRia.Grid.HEAD_COLUMN_SPLITER = "headColumnSpliter";
SweetDevRia.Grid.HEAD_COLUMN_BEFORE = "headColumnBefore";
SweetDevRia.Grid.TOOLBAR = "toolBar";
SweetDevRia.Grid.PAGEBAR = "pageBar";
SweetDevRia.Grid.DD_ARROW = "ddArrow";
SweetDevRia.Grid.BODY_TABLE = "bodyTable";
SweetDevRia.Grid.HEAD_TABLE = "headTable";
SweetDevRia.Grid.SORT_PROPERTIES = "sortPropertiesWindow";
SweetDevRia.Grid.GROUPING_PROPERTIES = "groupingPropertiesWindow";
SweetDevRia.Grid.EXCEL_PROPERTIES = "excelPropertiesWindow";
SweetDevRia.Grid.GRID_PROPERTIES = "gridPropertiesWindow";
SweetDevRia.Grid.SPLITER_SIZE = 2;
SweetDevRia.Grid.WINDOW_WIDTH = 500;
SweetDevRia.Grid.WINDOW_HEIGHT = 320;
SweetDevRia.Grid.NORMAL_PAGINATION_MODE = 0; // SWTRIA-1309
SweetDevRia.Grid.SELECT_PAGINATION_MODE = 1; // SWTRIA-1309

// SWTRIA-1303
SweetDevRia.Grid.PAGEBAR_HEIGHT = 24;
SweetDevRia.Grid.TOOLBAR_HEIGHT = 24; // Toolbar height in pixel - SWTRIA-977


/**
 * This method is called before Set the table cells tooltips To be overridden !!
 * 
 * @param {Array}
 *            data The new Table cells tooltips
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetTooltips  = function(tooltips){  /*
																		 * override
																		 * this
																		 */ return true;  };



/**
 * This method is called after Set the table cells tooltips
 * 
 * @param {Array}
 *            data The new Table cells tooltips To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetTooltips = function(tooltips){  /*
																	 * override
																	 * this
																	 */ };

/**
 * This method is called before Set the table data To be overridden !!
 * 
 * @param {Array}
 *            data The new Table data
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetData  = function(data){  /* override this */ return true;  };

/**
 * This method is called after Set the table data
 * 
 * @param {Array}
 *            data The new Table data To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetData = function(data){  /* override this */ };

/**
 * This method is called before Add a new column in the datagrid. This column is
 * added at the last position. To be overridden !!
 * 
 * @param {String}
 *            id Identifiant of this new column
 * @param {String}
 *            header Header text of this new column
 * @param {int}
 *            size Width of this new column
 * @param {boolean}
 *            ascendant Indicate if this column must be sorted. True indicate
 *            this column must be ascendant sorted, false descendant sorted and
 *            null if not sorted.
 * @param {boolean}
 *            visible Indicate if this column is visible
 * @param {boolean}
 *            resizable Indicate if this column will be resizable by the user
 * @param {boolean}
 *            sortable Indicate if this column will be sortable by the user
 * @param {boolean}
 *            hideable Indicate if this column will be hideable by the user
 * @param {boolean}
 *            editable Indicate if this column will be editable by the user
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeAddColumn  = function(id, header, size, ascendant, visible, resizable, sortable, hideable, editable){  /*
																																		 * override
																																		 * this
																																		 */ return true;  };

/**
 * This method is called after Add a new column in the datagrid. This column is
 * added at the last position.
 * 
 * @param {String}
 *            id Identifiant of this new column
 * @param {String}
 *            header Header text of this new column
 * @param {int}
 *            size Width of this new column
 * @param {boolean}
 *            ascendant Indicate if this column must be sorted. True indicate
 *            this column must be ascendant sorted, false descendant sorted and
 *            null if not sorted.
 * @param {boolean}
 *            visible Indicate if this column is visible
 * @param {boolean}
 *            resizable Indicate if this column will be resizable by the user
 * @param {boolean}
 *            sortable Indicate if this column will be sortable by the user
 * @param {boolean}
 *            hideable Indicate if this column will be hideable by the user
 * @param {boolean}
 *            editable Indicate if this column will be editable by the user To
 *            be overridden !!
 */
SweetDevRia.Grid.prototype.afterAddColumn = function(id, header, size, ascendant, visible, resizable, sortable, hideable, editable){  /*
																																		 * override
																																		 * this
																																		 */ };

/**
 * This method is called before Set the column visiblity To be overridden !!
 * 
 * @param {String}
 *            colId Identifiant of the column to set
 * @param {boolean}
 *            visibility the new visibility of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnVisibility  = function(colId, visibility){  /*
																						 * override
																						 * this
																						 */ return true;  };

/**
 * This method is called after Set the column visiblity
 * 
 * @param {String}
 *            colId Identifiant of the column to set
 * @param {boolean}
 *            visibility the new visibility of the column To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetColumnVisibility = function(colId, visibility){  /*
																					 * override
																					 * this
																					 */ };

/**
 * This method is called before Initialize the Grid. This method ms be called at
 * the page load !!! To be overridden !!
 * 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeInitialize = function(){  /* override this */ return true;  };

/**
 * This method is called after Initialize the Grid. This method ms be called at
 * the page load !!! To be overridden !!
 */
SweetDevRia.Grid.prototype.afterInitialize = function(){  /* override this */ };

/**
 * This method is called before Check or uncheck the html checkbox component
 * which check all checkboxes To be overridden !!
 * 
 * @param {boolean}
 *            select True to select the checkbox, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCheckboxAll = function (select){  /*
																		 * override
																		 * this
																		 */ return true;  };
	
/**
 * This method is called after Check or uncheck the html checkbox component
 * which check all checkboxes To be overridden !!
 * 
 * @param {boolean}
 *            select True to select the checkbox, else false
 */
SweetDevRia.Grid.prototype.afterSetCheckboxAll = function (select){  /*
																		 * override
																		 * this
																		 */ };

/**
 * This method is called before setting the check status of a row. Triggered on
 * check, after pagin... To be overridden !!
 * 
 * @param {String}
 *            rowId row identifiant
 * @param {boolean}
 *            select True to select the checkbox, else false
 * @param {boolean}
 *            testAll True if the method must test if all checbox are checked to
 *            check the checkboxAll, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCheckbox = function (rowId, select, testAll){  /*
																					 * override
																					 * this
																					 */ return true;  };
	
/**
 * This method is called after setting the check status of a row. Triggered on
 * check, after pagin... To be overridden !!
 * 
 * @param {String}
 *            rowId row identifiant
 * @param {boolean}
 *            select True to select the checkbox, else false
 * @param {boolean}
 *            testAll True if the method must test if all checbox are checked to
 *            check the checkboxAll, else false
 */
SweetDevRia.Grid.prototype.afterSetCheckbox = function (rowId, select, testAll){  /*
																					 * override
																					 * this
																					 */ };
	

/**
 * This method is called before Set the table width To be overridden !!
 * 
 * @param {int}
 *            width The new table width
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetWidth  = function(width){  /* override this */ return true;  };

/**
 * This method is called after Set the table width To be overridden !!
 * 
 * @param {int}
 *            width The new table width
 */
SweetDevRia.Grid.prototype.afterSetWidth = function(width){  /* override this */ };

/**
 * This method is called before Set the table height To be overridden !!
 * 
 * @param {int}
 *            height The new table height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetHeight  = function(height){  /*
																	 * override
																	 * this
																	 */ return true;  };

/**
 * This method is called after Set the table height To be overridden !!
 * 
 * @param {int}
 *            height The new table height
 */
SweetDevRia.Grid.prototype.afterSetHeight = function(height){  /* override this */ };

/**
 * This method is called before Set the table size To be overridden !!
 * 
 * @param {int}
 *            width The new table width
 * @param {int}
 *            height The new table height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetSize  = function(width, height){  /*
																		 * override
																		 * this
																		 */ return true;  };

/**
 * This method is called after Set the table size To be overridden !!
 */
SweetDevRia.Grid.prototype.afterSetSize  = function(){  /* override this */ };

/**
 * This method is called after the complete drag of the Grid To be overridden !!
 */
SweetDevRia.Grid.prototype.beforeResizing  = function(){  /* override this */ };

/**
 * This method is called after the complete drag of the Grid To be overridden !!
 */
SweetDevRia.Grid.prototype.afterResizing  = function(){  /* override this */ };

/**
 * This method is called before Set the selection mode of the table To be
 * overridden !!
 * 
 * @param {int}
 *            mode New selection mode. Possible valus are
 *            SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION,
 *            SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION ,
 *            SweetDevRia.Grid.CELLS_SELECTION
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetSelectionMode  = function(mode){  /*
																		 * override
																		 * this
																		 */ return true;  };

/**
 * This method is called after Set the selection mode of the table To be
 * overridden !!
 * 
 * @param {int}
 *            mode New selection mode. Possible valus are
 *            SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION,
 *            SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION ,
 *            SweetDevRia.Grid.CELLS_SELECTION
 */
SweetDevRia.Grid.prototype.afterSetSelectionMode  = function(mode){  /*
																		 * override
																		 * this
																		 */ };

/**
 * This method is called before Set the total data number of the table To be
 * overridden !!
 * 
 * @param {int}
 *            data number New total data number of the table
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetTotalDataNumber  = function(total){  /*
																			 * override
																			 * this
																			 */ return true;  };

/**
 * This method is called after Set the total data number of the table To be
 * overridden !!
 * 
 * @param {int}
 *            data number New total data number of the table
 */
SweetDevRia.Grid.prototype.afterSetTotalDataNumber  = function(total){  /*
																		 * override
																		 * this
																		 */ };

/**
 * This method is called before Set a row selection To be overridden !!
 * 
 * @param {String}
 *            rowId Identifiant of the row to select or unselect
 * @param {boolean}
 *            select select the row if true, else unselect
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetRowSelection  = function(rowId, select){  /*
																				 * override
																				 * this
																				 */ return true;  };

/**
 * This method is called after Set a row selection To be overridden !!
 * 
 * @param {String}
 *            rowId Identifiant of the row to select or unselect
 * @param {boolean}
 *            select select the row if true, else unselect
 */
SweetDevRia.Grid.prototype.afterSetRowSelection  = function(rowId, select){  /*
																				 * override
																				 * this
																				 */ };
	
/**
 * This method is called before Set a cell selection To be overridden !!
 * 
 * @param {String}
 *            rowId Row identifiant of the cell's row to select or unselect
 * @param {String}
 *            columnId Column identifiant of the cell to select or unselect
 * @param {boolean}
 *            select Select the cell if true, else unselect
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetCellSelection  = function(rowId, columnId, select){  /*
																							 * override
																							 * this
																							 */ return true;  };

/**
 * This method is called after Set a cell selection To be overridden !!
 * 
 * @param {String}
 *            rowId Row identifiant of the cell's row to select or unselect
 * @param {String}
 *            columnId Column identifiant of the cell to select or unselect
 * @param {boolean}
 *            select Select the cell if true, else unselect
 */
SweetDevRia.Grid.prototype.afterSetCellSelection  = function(rowId, columnId, select){  /*
																						 * override
																						 * this
																						 */ };

/**
 * This method is called before Clear all table selection To be overridden !!
 * 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeClearSelection = function(){  /* override this */ return true;  };

/**
 * This method is called after Clear all table selection To be overridden !!
 */
SweetDevRia.Grid.prototype.afterClearSelection  = function(){  /* override this */ };

/**
 * This method is called before Set the resizable column property To be
 * overridden !!
 * 
 * @param {String}
 *            colId Column identifiant to set
 * @param {boolean}
 *            resizable New value of te resizable property. If true, te use will
 *            be able to resize this column, else not
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnResizable  = function(colId, resizable){  /*
																					 * override
																					 * this
																					 */ return true;  };

/**
 * This method is called after Set the resizable column property To be
 * overridden !!
 * 
 * @param {String}
 *            colId Column identifiant to set
 * @param {boolean}
 *            resizable New value of te resizable property. If true, te use will
 *            be able to resize this column, else not
 */
SweetDevRia.Grid.prototype.afterSetColumnResizable  = function(colId, resizable){  /*
																					 * override
																					 * this
																					 */ };


/**
 * This method is called before Set the draggableColumns property. This property
 * indicate if the user can drag columns or not To be overridden !!
 * 
 * @param {boolean}
 *            draggable If true, the user can drag columns, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetDraggableColumns  = function(draggable){  /*
																				 * override
																				 * this
																				 */ return true;  };

/**
 * This method is called after Set the draggableColumns property. This property
 * indicate if the user can drag columns or not To be overridden !!
 * 
 * @param {boolean}
 *            draggable If true, the user can drag columns, else false
 */
SweetDevRia.Grid.prototype.afterSetDraggableColumns  = function(draggable){  /*
																				 * override
																				 * this
																				 */ };

/**
 * This method is called before Set the sortable column property, This property
 * indicate if the user can sort this column or not To be overridden !!
 * 
 * @param {String}
 *            colId Column to set
 * @param {boolean}
 *            sortable True if the user can sort this column, false if can't
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnSortable  = function(colId, sortable){  /*
																					 * override
																					 * this
																					 */ return true;  };

/**
 * This method is called after Set the sortable column property, This property
 * indicate if the user can sort this column or not To be overridden !!
 * 
 * @param {String}
 *            colId Column to set
 * @param {boolean}
 *            sortable True if the user can sort this column, false if can't
 */
SweetDevRia.Grid.prototype.afterSetColumnSortable  = function(colId, sortable){  /*
																					 * override
																					 * this
																					 */ };

/**
 * This method is called before Set a colum width To be overridden !!
 * 
 * @param {Stirng}
 *            colId Identifiant of the column to resize
 * @param {int}
 *            size New width of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnSize  = function(colId, size){  /*
																			 * override
																			 * this
																			 */ return true;  };

/**
 * This method is called after Set a colum width To be overridden !!
 * 
 * @param {Stirng}
 *            colId Identifiant of the column to resize
 * @param {int}
 *            size New width of the column
 */
SweetDevRia.Grid.prototype.afterSetColumnSize  = function(colId, size){  /*
																			 * override
																			 * this
																			 */ };

/**
 * This method is called before Set a column position To be overridden !!
 * 
 * @param {String}
 *            colId Identifiant of the column to move
 * @param {int}
 *            position New position of the column
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetColumnPosition  = function(colId, position){  /*
																					 * override
																					 * this
																					 */ return true;  };

/**
 * This method is called after Set a column position To be overridden !!
 * 
 * @param {String}
 *            colId Identifiant of the column to move
 * @param {int}
 *            position New position of the column
 */
SweetDevRia.Grid.prototype.afterSetColumnPosition  = function(colId, position){  /*
																					 * override
																					 * this
																					 */ };

/**
 * This method is called before Sort a column To be overridden !!
 * 
 * @param {String}
 *            colId Identifiant of the column to sort
 * @param {boolean}
 *            ascendant True is the column must be ascendant sorted, false for
 *            descendant sorting
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSortColumn  = function(colId, ascendant){  /*
																			 * override
																			 * this
																			 */ return true;  };

/**
 * This method is called after Sort a column To be overridden !!
 * 
 * @param {String}
 *            colId Identifiant of the column to sort
 * @param {boolean}
 *            ascendant True is the column must be ascendant sorted, false for
 *            descendant sorting
 */
SweetDevRia.Grid.prototype.afterSortColumn  = function(colId, ascendant){  /*
																			 * override
																			 * this
																			 */ };


/**
 * This method is called before Execute a multiple column sort To be overridden !!
 * 
 * @param {Array}
 *            columnsOrder Contains all columns order to sort.Each value is an
 *            array with the column id and the ascendant property. exemple :
 *            [["col4", true], ["col1", false], ["col3", true]]
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeMultipleColumnSort = function(columnsOrder){ /*
																				 * override
																				 * this
																				 */ return true;  };

/**
 * This method is called after Execute a multiple column sort To be overridden !!
 * 
 * @param {Array}
 *            columnsOrder Contains all columns order to sort.Each value is an
 *            array with the column id and the ascendant property. exemple :
 *            [["col4", true], ["col1", false], ["col3", true]]
 */
SweetDevRia.Grid.prototype.afterMultipleColumnSort  = function(columnsOrder){  /*
																				 * override
																				 * this
																				 */ };

/**
 * This method is called before Execute a multiple column sort To be overridden !!
 * 
 * @param {Array}
 *            grouping Contains all columns id to group by. exemple :
 *            ["col4","col1","col3"]
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeGroupingBy = function(grouping){ /*
																	 * override
																	 * this
																	 */ return true;  };

/**
 * This method is called after Execute a multiple column sort To be overridden !!
 * 
 * @param {Array}
 *            grouping Contains all columns id to group by. exemple :
 *            ["col4","col1","col3"]
 */
SweetDevRia.Grid.prototype.afterGroupingBy  = function(grouping){  /*
																	 * override
																	 * this
																	 */ };


/**
 * This method is called before Excel Export of rows To be overridden !!
 * 
 * @param {int}
 *            exportMode Define if we export in wysiwyg mode or model mode.
 *            Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and
 *            SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array}
 *            exportdRowIds Array containing all exported row ids. If null, all
 *            rows will be exported.
 * @param {String}
 *            exportId String representing the id of the export being processed.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeExcelExport = function(exportMode, exportdRowIds, exportId){ /*
																								 * override
																								 * this
																								 */ return true;  };

/**
 * This method is called after Excel Export of rows To be overridden !!
 * 
 * @param {int}
 *            exportMode Define if we export in wysiwyg mode or model mode.
 *            Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and
 *            SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array}
 *            exportdRowIds Array containing all exported row ids. If null, all
 *            rows will be exported.
 * @param {String}
 *            exportId String representing the id of the export being processed.
 */
SweetDevRia.Grid.prototype.afterExcelExport  = function(exportMode, exportdRowIds, exportId){  /*
																								 * override
																								 * this
																								 */ };

/**
 * This method is called before Change the displayed page into table pagination
 * To be overridden !!
 * 
 * @param {int}
 *            actualPage New displayed page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeGoToPage  = function(actualPage){  /*
																	 * override
																	 * this
																	 */ return true;  };

/**
 * This method is called after Change the displayed page into table pagination
 * To be overridden !!
 * 
 * @param {int}
 *            actualPage New displayed page number
 */
SweetDevRia.Grid.prototype.afterGoToPage  = function(actualPage){  /*
																	 * override
																	 * this
																	 */ };

/**
 * This method is called before Set the resizable property. This method hide or
 * show the resizer To be overridden !!
 * 
 * @param {boolean}
 *            resizable True if the ser can resize the table, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeSetResizable  = function(resizable){  /*
																		 * override
																		 * this
																		 */ return true;  };

/**
 * This method is called after Set the resizable property. This method hide or
 * show the resizer To be overridden !!
 * 
 * @param {boolean}
 *            resizable True if the ser can resize the table, else false
 */
SweetDevRia.Grid.prototype.afterSetResizable  = function(resizable){  /*
																		 * override
																		 * this
																		 */ };

/**
 * This method is called before showing the grid properties window To be
 * overridden !!
 * 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeShowGridProperties = function(){/*
																	 * override
																	 * this
																	 */ return true; };

/**
 * This method is called after showing the grid properties window To be
 * overridden !!
 */
SweetDevRia.Grid.prototype.afterShowGridProperties = function(){/* override this */ };

/**
 * This method is called before refreshing the grid To be overridden !!
 * 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Grid.prototype.beforeRefresh = function(){/* override this */ return true; };

/**
 * This method is called after refreshing the grid To be overridden !!
 */
SweetDevRia.Grid.prototype.afterRefresh = function(){/* override this */ };

/**
 * This method is called before changing the number of item displayed per page
 * To be overridden !!
 */
SweetDevRia.Grid.prototype.beforeChangeItemPerPage = function(itemPerPage){/*
																			 * override
																			 * this
																			 */  return true; };

/**
 * This method is called after changing the number of item displayed per page To
 * be overridden !!
 */
SweetDevRia.Grid.prototype.afterChangeItemPerPage = function(itemPerPage){/*
																			 * override
																			 * this
																			 */ };


/**
 * This event type is fired when sort a column
 * 
 * @static
 */
SweetDevRia.Grid.SORT_EVENT = "sort";

/**
 * This event type is fired when select a row
 * 
 * @static
 */
SweetDevRia.Grid.SELECT_ROW_EVENT = "selectRow";

/**
 * This event type is fired when unselect a row
 * 
 * @static
 */
SweetDevRia.Grid.UNSELECT_ROW_EVENT = "unselectRow";

/**
 * This event type is fired when select a cell
 * 
 * @static
 */
SweetDevRia.Grid.SELECT_CELL_EVENT = "selectCell";

/**
 * This event type is fired when unselect a cell
 * 
 * @static
 */
SweetDevRia.Grid.UNSELECT_CELL_EVENT = "unselectCell";

/**
 * This event type is fired when set the data
 * 
 * @static
 */
SweetDevRia.Grid.SET_DATA_EVENT = "setData";

/**
 * This event type is fired when show a column
 * 
 * @static
 */
SweetDevRia.Grid.SHOW_COL_EVENT = "showCol";

/**
 * This event type is fired when hide a column
 * 
 * @static
 */
SweetDevRia.Grid.HIDE_COL_EVENT = "hideCol";

/**
 * This event type is fired when check a row
 * 
 * @static
 */
SweetDevRia.Grid.CHECK_ROW_EVENT = "checkRow";

/**
 * This event type is fired when uncheck a row
 * 
 * @static
 */
SweetDevRia.Grid.UNCHECK_ROW_EVENT = "uncheckRow";

/**
 * This event type is fired when resize the grid
 * 
 * @static
 */
SweetDevRia.Grid.RESIZE_EVENT = "resize";

/**
 * This event type is fired when move a column
 * 
 * @static
 */
SweetDevRia.Grid.MOVE_COL_EVENT = "moveCol";

/**
 * This event type is fired when change the page
 * 
 * @static
 */
SweetDevRia.Grid.CHANGE_PAGE_EVENT = "changePage";

/**
 * This event type is fired when add a row
 * 
 * @static
 */
SweetDevRia.Grid.ADD_ROW_EVENT = "addRow";

/**
 * This event type is fired when delete a row
 * 
 * @static
 */
SweetDevRia.Grid.DELETE_ROW_EVENT = "deleteRow";

/**
 * This event type is fired when upodate a cell
 * 
 * @static
 */
SweetDevRia.Grid.UPDATE_CELL_EVENT = "updateCell";

/**
 * This event type is fired when refreshing the whole grid
 * 
 * @static
 */
SweetDevRia.Grid.REFRESH_GRID_EVENT = "refreshGrid";

/**
 * Set the name of the javascript function to be called when a datagrid column
 * is sorted.
 */
SweetDevRia.Grid.prototype.onSortColumn = null;

/**
 * Set the name of the javascript function to be called when a datagrid row is
 * selected.
 */
SweetDevRia.Grid.prototype.onSelectRow=null;

/**
 * Set the name of the javascript function to be called when a datagrid row is
 * unselected.
 */
SweetDevRia.Grid.prototype.onUnselectRow= null;

/**
 * Set the name of the javascript function to be called when a datagrid cell is
 * selected.
 */
SweetDevRia.Grid.prototype.onSelectCell= null;

/**
 * Set the name of the javascript function to be called when a datagrid cell is
 * unselected.
 */
SweetDevRia.Grid.prototype.onUnselectCell= null;

/**
 * Set the name of the javascript function to be called when the datagrid data
 * are modifed.
 */
SweetDevRia.Grid.prototype.onSetData= null;

/**
 * Set the name of the javascript function to be called when a datagrid column
 * is showed.
 */
SweetDevRia.Grid.prototype.onShowColumn= null;

/**
 * Set the name of the javascript function to be called when a datagrid column
 * is hide.
 */
SweetDevRia.Grid.prototype.onHideColumn= null;

/**
 * Set the name of the javascript function to be called when a datagrid row is
 * checked.
 */
SweetDevRia.Grid.prototype.onCheckRow=null;

/**
 * Set the name of the javascript function to be called when a datagrid row is
 * unchecked.
 */
SweetDevRia.Grid.prototype.onUncheckRow= null;

/**
 * Set the name of the javascript function to be called when a datagrid is
 * resized.
 */
SweetDevRia.Grid.prototype.onResize= null;

/**
 * Set the name of the javascript function to be called when a datagrid column
 * is moved.
 */
SweetDevRia.Grid.prototype.onMoveColumn= null;

/**
 * Set the name of the javascript function to be called when the user change
 * page.
 */
SweetDevRia.Grid.prototype.onChangePage= null;

/**
 * Set the name of the javascript function to be called when the user add a row.
 */
SweetDevRia.Grid.prototype.onAddRow= null;

/**
 * Set the name of the javascript function to be called when the user update a
 * cell.
 */
SweetDevRia.Grid.prototype.onUpdateCell= null;

/**
 * Set the name of the javascript function to be called when the user delete a
 * row.
 */
SweetDevRia.Grid.prototype.onDeleteRow= null;




/**
 * Define grouping columns ids
 * 
 * @param {Arrray}
 *            groupBy Array of column id to group.
 */
SweetDevRia.Grid.prototype.setGroupBy = function (groupBy) {

	this.groupBy = groupBy;

	this.tableHead = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.HEAD_TABLE);
	
	for (var i=0; i < groupBy.length; i++) {
		var groupById = groupBy [i];
		var col = this.getColumn (groupById);
		
		col.grouped =true;
		
		this.setColumnVisibility (groupById, false);
	}
	
};

/**
 * Process grouping data to save in groupingDataDescr property
 * 
 * @param {Array}
 *            dataGrp grouping data exemple : [ ["Sebastien", [ ["Revel", [
 *            ["Info",
 *            [["row0","31","toto1"],["row2","32","toto2"],["row3","33","toto3"]] ] ] ] ] ],
 *            ..... ]
 * @param {Array}
 *            tab
 * @param {Array}
 *            tabAll
 * @return grouping data to save in groupingDataDescr property ex :
 *         [["Sebastien", "Revel", "Info", 3], .....]
 * @private
 */
SweetDevRia.Grid.prototype.initGroupingData = function (dataGrp, tab, tabAll) {
	if (dataGrp == null) {
		dataGrp = this.data;
	}
	if (tab == null) {
		tab = [];
	}	
	if (tabAll == null) {
		tabAll = [];
	}	

	if (tab.length == this.groupBy.length) { 
		tab.push (dataGrp.length);
		tabAll.push (tab);
	}
	else {
		for (var i = 0; i < dataGrp.length; i++) {
			var name = dataGrp [i][0];
			if(name != "toJSONString") {
				var oldTab = [];
				oldTab.copy (tab);

				tab.push (name);

				var size = tabAll.length;  
				var tabAll = this.initGroupingData (dataGrp [i][1], tab, tabAll);

				if (tabAll.length > size) {
					tab = oldTab;
				}
			}
		}
	}
	
	return tabAll;
};


/**
 * Refresh the table content.
 */
SweetDevRia.Grid.prototype.refresh = function (){
	if (this.beforeRefresh()) {
		this.rowsLoaded = false;
		this.loadRows();
		this.fireEventListener (SweetDevRia.Grid.REFRESH_GRID_EVENT);
		this.afterRefresh();
	}
}; 


/**
 * Return the html text writted in the grouping rows header To be overridden !!
 * 
 * @return blocDescr grouping data description ex : ["Sebastien", "Revel",
 *         "Info", 3]
 * @param {Array}
 *            blocDescr
 * @return html text writted in the grouping rows header
 * @type String
 */
SweetDevRia.Grid.prototype.getBlocHeaderHtml = function (blocDescr) {
	var str = [];

	for (var i = 0; i < blocDescr.length - 1; i++) {
		str.push(blocDescr[i],", ");
	}
	str.push(blocDescr[blocDescr.length - 1]," items");
	
	return str.join('');
};

/**
 * Return the position of one bloc with this name
 * 
 * @param {Object}
 *            blocDescr the bloc description
 * @param {Object}
 *            name the bloc name to find
 * @return position of one bloc with this name
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.blocDescrIndexOf = function (blocDescr, name) {
	for (var i = 0; i < blocDescr.length; i++) {
		if (blocDescr[i][0] == name) {
			return i;
		}
	}
	return -1;
};

/**
 * Return the displayed rows number
 * 
 * @return displayed rows number
 * @type int
 */
SweetDevRia.Grid.prototype.getVisibleRowNumber = function () {
	// SWTRIA-1206
	// lors du grouping le this.goupBy peut etre vide alors que les donnees
	// groupees sont
	// toujours affichees
	if (this.groupBy && this.groupingDataDescr) {
		var sum = 0;
		for (var i = 0; i < this.groupingDataDescr.length; i++) {
			var blocDescr = this.groupingDataDescr [i];
			sum += 	blocDescr [blocDescr.length - 1];
		}
		
		return sum;
	}
	else {
		return this.data.length;		
	}
};

/**
 * Return all rows of this bloc
 * 
 * @param {int}
 *            blocDescrIndex Index oif the searced bloc
 * @return all rows of this bloc
 * @type Array
 * @private
 */
SweetDevRia.Grid.prototype.getRowsForBloc = function (blocDescrIndex) {
	// SWTRIA-1206
	// lors du grouping le this.goupBy peut etre vide alors que les donnees
	// groupees sont
	// toujours affichees
	if (this.groupBy && this.groupingDataDescr) {
		var blocDescr = this.groupingDataDescr [blocDescrIndex];
		var dataGroup = this.data;
		for (var i = 0; i < blocDescr.length - 1; i++) {
			var name = blocDescr[i];
			var pos = this.blocDescrIndexOf(dataGroup, name); 
			dataGroup = dataGroup [pos] [1];
		}
		
		return dataGroup;
		
	}
	return null;
};


/**
 * Return the html string representing a row group
 * 
 * @param {int}
 *            blocDescrIndex The index of the bloc description to displayed
 * @return html string representing a row group
 * @type String
 * @private
 */

SweetDevRia.Grid.prototype.getRowBlocStr = function (blocDescrIndex) {
	if (this.groupBy && this.groupBy.length > 0 && this.groupingDataDescr) {
		var str = [];
		this.blocDescrIndex = blocDescrIndex;
		var blocDescr = this.groupingDataDescr [blocDescrIndex];
		str.push(this.veloGrouping());
		var dataGroup = this.getRowsForBloc (blocDescrIndex);
		var oldData = this.data;
		this.data = dataGroup;
		str.push(this.veloData());
		this.data = oldData;
		this.blocDescrIndex = null;
		return str.join('');
	}
	return null;
};


/**
 * Return the html string representing the grouping head zone
 * 
 * @return html string representing the grouping head zone
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.veloGroupHead = function(){
	var text = [];
	var indexEmptyCols = this.createIndexEmptyCols ();
	for (var i = indexEmptyCols.length - 1; i >= 0; i -- ) {
		var headersRowIndex = indexEmptyCols [i];
		text.push('<tr style="white-space: nowrap;">');

		if(this.displayCheckbox){
    		text.push('<td class="ideo-ndg-headEmptyGroup" style="width:',this.checkboxColWidth,'px;');
        	if(this.heightHeader>0){
        		text.push('height : ',this.heightHeader,'px');
        	}
        	text.push('">&nbsp;</td>');
        	text.push('<td class="ideo-ndg-headSeparator" style="');
        	if(this.heightHeader>0){
	        	text.push('height : ',this.heightHeader,'px;');
    	    }
        	text.push('">&nbsp;</td>');
		}
		
		// Ajout des header geeneeree dans la boucle plus haut
		for(var j=0; j<headersRowIndex.length; j++){
			var groupId = headersRowIndex [j];
			if (!groupId) {
				text.push('<td class="ideo-ndg-headEmptyGroup">&nbsp;</td>');
				text.push('<td class="ideo-ndg-headEmptyGroup">&nbsp;</td>');
			}
			else if(typeof(groupId) == "number"){
				// text.push('<td class="ideo-ndg-headEmptyGroup"
				// colspan="',(2*groupId-1),'">&nbsp;</td>');
				text.push('<td class="ideo-ndg-headEmptyGroup" colspan="',(3*groupId-1),'">&nbsp;</td>');
				j += groupId - 1 ;
			}
			else {
				var group = this.getGroup (groupId);
				text.push('<td id="',this.headPrefix,group.id,'" class="ideo-ndg-header"');
				// text.push(' colspan="'+(2*group.colspan - 1)+'" ');
				text.push(' colspan="'+(3*group.colspan - 1)+'" ');
				if(this.heightHeader>0){
					text.push(' style="height : ',this.heightHeader,'px"');
				}
				text.push('><nobr>',group.label,'');
				text.push('</nobr></td>');
				j += group.colspan - 1 ;
			}

			if(j != headersRowIndex.length - 1){
		    	text.push('<td class="ideo-ndg-headGroupSeparator" ');
		        if(this.heightHeader>0){
		        	text.push('style="height : ',this.heightHeader,'px"');
		        }
		        text.push('>&nbsp;</td>');
			}
	 	}
		text.push('</tr>');
	}	
	return text.join ("");
};


/**
 * Return if the column has a parent group
 * 
 * @return boolean representing the column's belonging of the group
 * @private
 */
SweetDevRia.Grid.prototype.colHasParent = function(group){
	return ((group.parentGroupId != null) && (group.parentGroupId != 'undefined'));
};


/**
 * Create the structure for the grouping column header functionnality like this
 * following example
 * 
 * indexEmptyCol = [ [null, "G1", "G1", "G1", null, "G2", "G3, "G3", "G3"],
 * [null, 3 , 3 , 3 , null, "GG1", "GG1", "GG1", "GG1"] ]
 * 
 */	
SweetDevRia.Grid.prototype.createIndexEmptyCols = function(){
	var indexEmptyCols = []; 
	for(var j=0; j < this.maxGroupDepth; j++){
		indexEmptyCols[j] = [];
	}
	for(var i=0; i < this.columnNumber; i++){
		var element = this.getColumnAtPosition(i);
		if(this.colHasParent(element)){
			var depth = 0;
			while(this.colHasParent(element)){
				indexEmptyCols[depth][i] = element.parentGroupId;
				element = this.getGroup(element.parentGroupId);
				depth++;
			}
			for(var j=depth; j < this.maxGroupDepth; j++){
				indexEmptyCols[j][i]=element.colspan;
			}			
		}
		else{
			for(var j=0; j < this.maxGroupDepth; j++){
				indexEmptyCols[j][i]=null;
			}
		}
	}
	return indexEmptyCols;
};


SweetDevRia.Grid.prototype.veloHead = function(){
	var text = [];
	var temp = [];
	
	text.push('<style type="text/css">');
	for(var i=0;i<this.columnNumber;i++){
		var column = this.getColumnAtPosition(i);
		text.push('.',this.id,'_cellule_',column.id,'{');
		text.push('width: ',column.size,'px;');
		text.push('}');
	}
	text.push('</style>');
	
	text.push('<div id="',this.id,'" class="ideo-ndg-table" style="width : ',this.width,';height : ',parseInt(this.height,10),'px;">');

	this.generateToolbar(text, true);

    text.push('<div id="',this.ddArrowId,'" class="ideo-ndg-arrow"></div>');
    
    // SWTRIA-1115
    // Ajout d'un div englobant le headDiv et le scrollDissembler
    text.push('<div id="',this.id,'_overHeadDiv">');
    // SWTRIA-1115
    // Ajout d'un float:left sur le divHeader
    text.push('<div class="ideo-ndg-divHeader" id="',this.id,'_headDiv" style="float:left" >');
    text.push('<table id="',this.id,'_headTable"  class="ideo-ndg-head" cellpadding="0px" cellspacing="0px" >');

 	text.push('<tbody id="',this.theadId,'">');

    text.push('<colgroup id="',this.id,'_headTable_colgroup">');
	if(this.displayCheckbox){
		text.push('<col id="',this.id,'_head_col_checkbox" style="width:',this.checkboxColWidth,'px;" >');
		text.push('<col id="',this.id,'_head_spliter_checkbox" style="">');
	}
	for(var i=0;i<this.columnNumber;i++){
		// Generation des header
		var column = this.getColumnAtPosition(i);
		// SWTRIA-1206
		// il faut un id pour pouvoir le rendre visible/invisible
		text.push('<col id="',this.id,'_head_before_',column.position,'" style="'); // srevel: col pour le probleme de multiheader sous IE
																					
		text.push(this.setElementVisibility (null, column.visible, 1));
		text.push('">');
		
		text.push('<col id="',this.id,'_head_col_',column.position,'" style="');
		
		var headerSize = this.getColumnSize(column) - 1; // srevel : le -1 sert a compenser la col de 1px qui corrige le bug des multi headers
		
		text.push(this.setElementVisibility (null, column.visible, headerSize));

		text.push('">');
		if(column != this.getLastColumn()){
			text.push('<col id="',this.id,'_head_spliter_',column.position,'" style="');

			text.push(this.setElementVisibility(null,column.visible,SweetDevRia.Grid.SPLITER_SIZE));

			text.push('">');
		}
			
		// On profite de la boucle pour generer les td
		temp.push('<td id="',this.headBeforePrefix,column.id,'" class="ideo-ndg-header">&nbsp;</td>');// srevel:
																										// col
																										// pour
																										// le
																										// probleme
																										// de
																										// multiheader
																										// sous
																										// ie
		temp.push('<td id="',this.headPrefix,column.id,'" class="ideo-ndg-header" style="');
		if(this.heightHeader>0){
			temp.push('height : ',this.heightHeader,'px');
		}
		temp.push('" onmouseover="SweetDevRia.$(\'',this.id,'\').setColumnSortClass(\'',column.id,'\',null,true);" onmouseout="SweetDevRia.$(\'',this.id,'\').setColumnSortClass(\'',column.id,'\',null,false);"><nobr>',column.header,'');
		temp.push('<div id="',this.headPrefix,column.id,'_edit" class="ideo-ndg-headerEditableDiv ');
		if(column.editable){
			temp.push('ideo-ndg-headerEditable');
		} 
		temp.push('" >&nbsp;&nbsp;&nbsp; </div>');
		temp.push('<div id="',this.headPrefix,column.id,'_sort"   title="',this.getMessage('sortTitle'),'"  class="ideo-ndg-headerSort');
		if(column.ascendant === true){ 
			temp.push(' ideo-ndg-headerSortAsc ');
		}else if(column.ascendant === false){
			temp.push(' ideo-ndg-headerSortDesc ');
		}
		temp.push('">'); // SWTRIA-1311
		temp.push('<img src="',SweetDevRIAImagesPath,'/pix.gif" alt="',this.getMessage('sortTitle'),'"/>');
		temp.push('&nbsp;&nbsp;&nbsp; </div>  </nobr></td>');
		if(column != this.getLastColumn()){
	    	temp.push('<td id="',this.spliterPrefix,'',column.id,'" class="ideo-ndg-headSeparator" ');
	        if(this.heightHeader>0){
	        	temp.push('style="height : ',this.heightHeader,'px"');
	        }
	        temp.push('>&nbsp;</td>');
		}
 	}
 	text.push('</colgroup>');

	text.push(this.veloGroupHead ());

	text.push('<tr style="white-space: nowrap;">');

	if(this.displayCheckbox){
    	text.push('<td id="',this.headPrefix,'checkbox" class="ideo-ndg-header" style="width:',this.checkboxColWidth,'px;');
        if(this.heightHeader>0){
        	text.push('height : ',this.heightHeader,'px');
        }
        text.push('">');
       if (this.rowSelectorType == SweetDevRia.Grid.ROW_SELECTOR_CHECKBOX) { // SWTRIA-1305
        	text.push('<input type="checkbox" id="',this.id,'_col_checkboxAll" onclick="SweetDevRia.$(\'',this.id,'\').setCheckboxAll(this.checked);" title="',this.getMessage('gridCheckAll'),'"/>');
        }
        else {
            text.push('&nbsp;');
        }
        text.push('</td>');
        text.push('<td id="',this.spliterPrefix,'checkbox" class="ideo-ndg-headSeparator" style="');
        if(this.heightHeader>0){
        	text.push('height : ',this.heightHeader,'px;');
        }
        text.push('cursor:default;">&nbsp;</td>');
	}
	// Ajout des header genere dans la boucle plus haut
	text.push(temp.join(''));
	text.push('</tr>');
    text.push('</tbody>');
    text.push('</table>');
    
    // fin du headDiv
    text.push('</div>');
    
    // SWTRIA-1115 et SWTRIA-1203
    // Ajout du div servant a cacher une partie des header
    // lors de l'apparition de la scollbar sur le bodyDiv
    text.push(this.veloHeadDissembler());
    
    // SWTRIA-1115
    // Positionnement par colonne des div du header
    text.push('<div style="clear: right;"></div>');
    
    // SWTRIA-1115
    // fin du overHeadDiv
    text.push('</div>');
    
    // generation du bodyDiv
    text.push('<div class="ideo-ndg-divBody" id="',this.id,'_bodyDiv" onscroll="SweetDevRia.$(\'',this.id,'\').synchronizeHeader()" ');
    // SWTRIA-1115
    // Ajout d'un float:left sur le divBody
    text.push('style="float:left;');
    // SWTRIA-1303 : code supprime
    text.push('"');
    text.push('>');
    text.push('</div>');

	this.generateToolbar(text, false);

	
	return text.join('');
};

/**
 * Generate the HTML source for whole toolbar (buttons bar and page bar)
 * SWTRIA-1303
 * 
 * @param text :
 *            text flow where HTML code is added
 * @param isTop :
 *            is toolbar at the top of the grid
 * @private
 */
SweetDevRia.Grid.prototype.generateToolbar = function (text, isTop) {
	var toolBarId = (isTop)? this.topToolBarId: this.bottomToolBarId;
	
	// div englobant la TOOLBAR (different de la pagebar)
	text.push('<div id="', toolBarId,'" class="ideo-ndg-toolbar" style="float:left;">');
	
	this.generateButtonbar(text, isTop);
	
	this.generatePagebarContainer(text, isTop);
	
	text.push('</div>');	
	// fin du div de la TOOLBAR
};

/**
 * Generate the HTML source for buttonbar SWTRIA-1303
 * 
 * @param text :
 *            text flow where HTML code is added
 * @param isTop :
 *            is toolbar at the top of the grid
 * @private
 */
SweetDevRia.Grid.prototype.generateButtonbar = function (text, isTop) {
	
	if (isTop) {
		return;
	}
	
  	text.push('<div id="',this.id,'_buttons" class="ideo-ndg-buttonsbar ideo-ndg-icons" >');
  	if(this.showPropertyButton){
  		text.push('<img id="',this.id,'_gridproperties_button" onclick="SweetDevRia.$(\'',this.id,'\').showGridProperties();" class="ideo-ndg-propertiesIcon ideo-ndg-icon" src="',SweetDevRIAImagesPath,'/pix.gif" title="',this.getMessage('gridProperties'),'" alt="',this.getMessage('gridProperties'),'"/>');
  	}
  	if(this.showExportButton && this.innerExportId){ // SWTRIA-1312
  		text.push('<img id="',this.id,'_gridexport_button" onclick="SweetDevRia.$(\'',this.id,'\').callExportExcel();" class="ideo-ndg-exportIcon ideo-ndg-icon" src="',SweetDevRIAImagesPath,'/pix.gif" title="',this.getMessage('exportExcelProperties'),'" alt="',this.getMessage('exportExcelProperties'),'"/>');
  	}
  	text.push('</div>');
    text.push('<div id="',this.id,'Menu_container" style="display:none">&nbsp;</div>');
    text.push('<div id="',this.sortPropertiesWindowId,'_container" style="display:none">&nbsp;</div>');
    if(this.showPropertyButton){
    	text.push('<div id="',this.gridPropertiesWindowId,'_container" style="display:none">&nbsp;</div>');
    }
    text.push('<div id="',this.groupingPropertiesWindowId,'_container" style="display:none">&nbsp;</div>');
    text.push('<div id="',this.excelPropertiesWindowId,'_container"  style="display:none">&nbsp;</div>');
    text.push('<a href="#" id="',this.id,'_activatorManager" onblur="SweetDevRia.$(\'',this.id,'\').setActive(false);" class="ideo-ndg-activatorManager">&nbsp</a>');
}

/**
 * Generate the HTML source for buttonsbar SWTRIA-1303
 * 
 * @param text :
 *            text flow where HTML code is added
 * @param isTop :
 *            is toolbar at the top of the grid
 * @private
 */
SweetDevRia.Grid.prototype.generatePagebarContainer = function (text, isTop) {
	var pageBarId = (isTop)? this.topPageBarId: this.bottomPageBarId;
  	text.push('<div id="',pageBarId,'_container" class="ideo-pgb-pagebar ideo-ndg-pagebar"');
  	if(this.pageNumber <= 1){
  		text.push(' style="display:none;"');
  	}
  	text.push('>');
   	text.push("&nbsp;");
   	text.push("</div>");
}


// SWTRIA-1203
// Ajout du div servant a cacher une partie des header de la largeur de la barre
// de scrolling verticale
// lors de l'apparition de celle-ci sur le bodyDiv
SweetDevRia.Grid.prototype.veloHeadDissembler = function(){
	var text = [];
	text.push('<div id="',this.id,'_headScrollDissembler" style="display:none;float:left">');
    text.push('<table id="',this.id,'_headSDTable"  class="ideo-ndg-head" cellpadding="0px" cellspacing="0px" >');
    
    var lastColumn = this.getLastColumn();
    // en cas de multiheader
    // on ajoute un dissimulateur pour chaque ligne de header
    for(var i=0; i <= this.maxGroupDepth; i++){
	    text.push('<tr style="white-space: nowrap;">');
	    text.push('<td style="height:',this.heightHeader,'px;" class="ideo-ndg-header" onmouseover="SweetDevRia.$(\'',this.id,'\').setColumnSortClass(\'',lastColumn.id,'\',null,true);" onmouseout="SweetDevRia.$(\'',this.id,'\').setColumnSortClass(\'',lastColumn.id,'\',null,false);">&nbsp;</td>');
		text.push('</tr>');
    }
	
	text.push('</table>');
    text.push('</div>');
    return text.join('');
}

SweetDevRia.Grid.prototype.veloGrouping = function(){
	var text = [];
	// SWTRIA-1206
	// tant que les donnees ne sont pas affichees on fixe la largeur
	// des groupHeaders a celle de la grid
	text.push('<div id=\"',this.id,'_groupHeader_',this.blocDescrIndex,'\" class="ideo-ndg_groupH ideo-ndg-headerGroup" style=\"white-space:nowrap;width:',this.getSize(this.width),'px\"');
	text.push(' onclick=\"SweetDevRia.$(\'',this.id,'\').swapRowBloc(',this.blocDescrIndex,');\" >');


	if(this.displayCheckbox && 
		(this.rowSelectorType == SweetDevRia.Grid.ROW_SELECTOR_CHECKBOX)){ // SWTRIA-1305
        text.push('<input type="checkbox" id="',this.id,'_col_checkboxGroup',this.blocDescrIndex,'-',this.actualPage, '" ');
        text.push(' onclick=\"SweetDevRia.$(\'',this.id,'\').setCheckboxGroup(this.checked,',this.blocDescrIndex,',event);\"');
		if (this.checkedGroupRows.contains (this.blocDescrIndex+'-'+this.actualPage)){
			text.push(" checked");
		}
        text.push('>');
	}

    text.push('<img id=\"',this.id,'_groupHeader_',this.blocDescrIndex,'_icon\" src=\"',SweetDevRIAImagesPath,'/pix.gif\" class=\"ideo-ndg-groupingIcon\" title=\"\" alt=\"\"/>');
	text.push(this.getBlocHeaderHtml(this.groupingDataDescr [this.blocDescrIndex]));
   	text.push('</div>');
   	return text.join('');
};




SweetDevRia.Grid.prototype.veloData = function() {
	var context = this;
	var text = [];
	var colSizes = [];
	var firstPass = true;
	var nrow=0;
	if (this.groupBy == null || this.groupBy.length == 0){
		// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
		text.push('<div id="',this.id,'_',SweetDevRia.Grid.BODY_TABLE,'">');
	}
	for (var row_index = 0; row_index < this.data.length; row_index++){
		var row = this.data[row_index];
		var rowId = row[0];
		
		if (this.groupBy != null && this.groupBy.length > 0 && this.groupingDataDescr != null){
			var dataRow = [];
			dataRow[0] = rowId;
			var blocDescr = this.groupingDataDescr [this.blocDescrIndex];
			if (blocDescr){
				for (var iindex = 0; iindex < blocDescr.length; iindex++){
					var value = blocDescr[iindex];
					if (iindex < blocDescr.length - 1){
						var columnId = this.groupBy[iindex];
						var column = this.getColumn(columnId);
						dataRow[column.position + 1] = value;
					}
				}
				var cpt = 0;
				var pos = 1;
				for (var iindex = 0; iindex < this.columnNumber; iindex++){
					var col = this.columns[iindex];
					var column = this.getColumnAtPosition(''+cpt);
					if (! this.groupBy.contains (column.id)){
						dataRow[column.initialPosition + 1] = row [pos];
						pos = pos + 1;
					}
					cpt = cpt + 1;
				}
			}
			dataRow[dataRow.length] = row[row.length-1];
			var row = dataRow; // Dans le cas ou on fait un groupBy on utilise
								// des data alteereees
		}
		
		this.groupedData[rowId] = row;
		this.listRows.push(row[0]);
		// SWTRIA-1224
		// Le nombre de colonnes de la ligne precedente pour le colspan de la
		// ligne de details
		var colNumber = (this.displayCheckbox == true) ? (((this.columnNumber) * 2)-1 +2) : (((this.columnNumber) * 2)-1);
		if (row_index >= this.getFirstVisibleIndex() && row_index <= this.getLastVisibleIndex()){

			text.push("<div><table onclick=\"SweetDevRia.Grid.selectCell(event);\" id=\"",this.id, "_table_", rowId,"\" class=\"ideo-ndg-body");
			text.push("\" businessId=\"",rowId,"\">");
			
			text.push("<tbody>");
				
    	    text.push("<tr id=\"", this.id, "_tr_", rowId, "\" class=\"ideo-ndg-row ", ((row_index%2 == 0)?"ideo-ndg-parRow":"ideo-ndg-oddRow"));
			if (this.isInSelection(rowId) == true){
				text.push (" ideo-ndg-selection");
			}
			
			text.push("\" style=\"");
			if (this.heightRow!==null){
				text.push("height : ", this.heightRow,"px;");
			}
			text.push("\">");
			if (this.displayCheckbox == true){
				var tooltips = this.tooltips[rowId];
				var disabledCheck = false;
				if(tooltips){
					disabledCheck = this.tooltips[rowId][tooltips.length-1];
				} 
				// SWTRIA-1305
                text.push("<td style=\"text-align:center;width:",this.checkboxColWidth,"px;\">");

                if (this.rowSelectorType == SweetDevRia.Grid.ROW_SELECTOR_CHECKBOX) {
	                text.push("<input type=\"checkbox\" id=\"", this.id, "_col_", rowId,"_checkbox\"");
	                text.push(" title=\"", this.getMessage("gridCheck")  ,"\" ");
	                if (this.checkedRows.contains (rowId)){
						text.push(" checked");
					}
					text.push(" onclick=\"SweetDevRia.$('", this.id,"').setCheckbox('", rowId,"', this.checked);\"");

					if(disabledCheck){
						text.push(" disabled");					
					}
					text.push("/>");
		        }
		        else if (this.rowSelectorType == SweetDevRia.Grid.ROW_SELECTOR_RADIO){
	                text.push("<input type=\"radio\" id=\"", this.id, "_col_", rowId,"_checkbox\" name=\"", this.id, "_col_radio\"");
	                text.push(" title=\"", this.getMessage("gridCheck")  ,"\" ");
	                if (this.checkedRows.contains (rowId)){
						text.push(" checked");
					}
					text.push(" onclick=\"SweetDevRia.$('", this.id,"').checkedRows=[];SweetDevRia.$('", this.id,"').setCheckbox('", rowId,"', true, false);\"");

					if(disabledCheck){
						text.push(" disabled");					
					}
					text.push("/>");
		        }
				text.push("</td>");
	            text.push("<td class=\"ideo-ndg-bodySeparator ideo-ndg-cell\"></td>");
			}
			var cpt = 0;
			for (var iindex=0; iindex < row.length; iindex++){
				cell = row[iindex];
				var columnId = this.getColumnIdAtPosition(''+(parseInt(cpt, 10)-1));
				var curcol = this.getColumnAtPosition(''+(parseInt(cpt, 10)-1));
				if (cpt > 0){
	 				if (this.isTreeGrid && cpt == 1){
	                    text.push("<td ");
						if (this.tooltips && this.tooltips[nrow] && this.tooltips[nrow][cpt]){
							text.push("title=\"",this.tooltips[nrow][cpt], "\"");
						} 
						text.push(" id=\"", this.id, "_cell_",rowId, "_",columnId, "\" ");
						if (this.isInSelection([rowId, columnId]) == true){
							text.push("class=\" ideo-ndg-selection \"");
						}
						text.push(" style=\"",this.setElemVisibility(null,true,this.defaultRowSize),"\""); // SWTRIA-1313
						text.push(">");
						if (this.rowWrap == false){text.push("<nobr>");}
						text.push(this.renderTreeNode(rowId));
						if (this.rowWrap == false){text.push("</nobr>");}
	                    text.push("</td>");
						if (cpt!=(row.length-2)){
		                    // text.push("<td id=\"", this.id, "_cell_spliter_",
							// rowId, "_", columnId, "\"
							// class=\"ideo-ndg-bodySeparator\"><nobr>&nbsp;</nobr></td>");
		                    text.push("<td id=\"", this.id, "_cell_spliter_", rowId, "_", columnId, "\" class=\"ideo-ndg-cell ideo-ndg-bodySeparator\"></td>");
						}
					}
					else{	
						if (cpt!=(row.length-1)){
							if(firstPass){
								colSizes[columnId] = this.getColumnSize(curcol);

								// SWTRIA-1206 : code supprime
							}
							text.push("<td ");
							if (this.tooltips && this.tooltips[rowId] && this.tooltips[rowId][cpt]){
								text.push("title=\"", this.tooltips[rowId][cpt], "\"");
							}
							text.push("id=\"", this.id, "_cell_", rowId, "_", columnId, "\"");

							text.push("style=\"",this.setElemVisibility(null,curcol.visible,colSizes[columnId])); // NIS

							if (curcol.style){text.push(curcol.style);}
							text.push("\"");
							text.push(" class=\"ideo-ndg-cell "+this.id+"_cellule_"+columnId+" ");
							if(curcol.sortOrder!=null){
								// SWTRIA-882
								var parityRow = (row_index%2 == 0)?"par":"odd";
								if(curcol.ascendant){
									text.push(" ideo-ndg-sortCell-asc-"+parityRow+" ");
								}
								else{
									text.push(" ideo-ndg-sortCell-desc-"+parityRow+" ");
								}
							}
							
							
							if (this.isInSelection([rowId, columnId]) == true){
								text.push(" ideo-ndg-selection ");
							}
							if (curcol.styleClass){
								text.push(curcol.styleClass);
							}
							text.push("\">");
							if (this.rowWrap == false) {
								text.push("<nobr>");
							}
							var rowData = row[this.getColumnAtPosition(''+(parseInt(cpt, 10)-1)).initialPosition + 1];
							if (!rowData){
								text.push("&nbsp;"); // SWTRIA-1296
							}
							else {
								if (curcol.formater != null ){
									var curData = window[curcol.formater](rowData);
									text.push(curData);
								}
								else {
									text.push(rowData);
								}
							}
							if (this.rowWrap == false){
								text.push("</nobr>");
							}
		                    text.push("</td>");
							if (cpt!=(row.length-2)) {
text.push("<td id=\"", this.id, "_cell_spliter_", rowId, "_", columnId, "\" class=\"ideo-ndg-cell ideo-ndg-bodySeparator\" style=\"",this.setElemVisibility(null,curcol.visible,SweetDevRia.Grid.SPLITER_SIZE) ,"\"></td>");
							}
						}
						else {
		                	text.push("</tr>");
							if (cell!=null) {	
								text.push("<tr id=\"", this.id,"_tr_detail_", rowId, "\"  class=\"ideo-ndg-detail ", ((row_index%2 == 0)?"\"ideo-ndg-parRow\"":"\"ideo-ndg-oddRow\""), "\">");
								text.push("<td ");
								if (this.tooltips && this.tooltips[nrow] && this.tooltips[nrow][cpt]){
									text.push("title=\"", this.tooltips[nrow][cpt], "\"");
								}
								text.push("colspan=\"", colNumber, "\"  >");
								if (cell!=null) {
									text.push("<div id=\"", this.id, "_", rowId, "_detailIcon_left\" onclick=\"SweetDevRia.$('", this.id, "').swapDetailVisibility('", rowId, "'); return false;\" class=\"ideo-ndg-detailIconLeft ideo-ndg-detailIconClose\">&nbsp;</div>");
									text.push("<div id=\"", this.id, "_", rowId, "_detailIcon_right\" onclick=\"SweetDevRia.$('", this.id, "').swapDetailVisibility('", rowId, "'); return false;\" class=\"ideo-ndg-detailIconRight ideo-ndg-detailIconClose\">&nbsp;</div>");
									text.push("<div id=\"", this.id, "_", rowId, "_detailIcon\" onclick=\"SweetDevRia.$('", this.id, "').swapDetailVisibility('", rowId, "'); return false;\" class=\"ideo-ndg-detailIcon ideo-ndg-detailIconClose\">&nbsp;</div>");
									text.push("<div id=\"", this.id, "_detail_", rowId, "\" style=\"display:none;\">");
									text.push(cell);
									text.push("</div>");
								}
								text.push("</td>");
								text.push("</tr>"); // SWTRIA-1296
							}
						}
					}
				}
				cpt = cpt + 1;
			}

			text.push("</tbody></table></div>");

			firstPass = false;
		}
		nrow = nrow + 1;
	}
	if (this.groupBy == null || this.groupBy.length == 0){
   		text.push('</div>');
		// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
	}
	
	return text.join("");
};


SweetDevRia.Grid.selectCell = function (event){
	var originalTarget=YAHOO.util.Event.getTarget(event);
	var cellTD;
	if(originalTarget.nodeName=="TD"){ // mettre en majuscule
		cellTD=originalTarget;
	} else {
		cellTD=originalTarget.parentNode;	// cas du NOBR
	}
	
	var myGrid = SweetDevRia.$(cellTD.id.split("_cell_")[0]);

	if(myGrid){
		var rowId = myGrid.getRowBusinessId(cellTD);
		var columnId = myGrid.getColBusinessId(cellTD);
		
		myGrid.fireEventListener (SweetDevRia.Grid.SELECT_CELL_EVENT, [event, rowId, columnId]);

		myGrid.onSelectCellEvt(event, rowId, columnId);
	}
	else {
		null;		
	}
};


SweetDevRia.Grid.prototype.getRowBusinessId = function (node){
	var tab = node.parentNode.id.split("_tr_");
	return tab[tab.length-1];
};

SweetDevRia.Grid.prototype.getColBusinessId = function (node){
	var rowId = this.getRowBusinessId(node);

	var split = node.id.split(this.id+"_cell_"+rowId+"_");
	return split[split.length-1];
};

/**
 * Set the cells tooltips
 * 
 * @param {Array}
 *            tooltips The new cells tooltips
 */
SweetDevRia.Grid.prototype.setTooltips = function (tooltips) {
	if (this.beforeSetTooltips (tooltips)) {
		this.tooltips = tooltips;
		
		this.afterSetTooltips (tooltips);
	}
};

/**
 * Set the table data
 * 
 * @param {Array}
 *            data The new Table data
 */
SweetDevRia.Grid.prototype.setMinHeight = function (minHeight) {
	this.minHeight = parseInt(minHeight, 10);
};

/**
 * Set the new max height constraint for the resize
 * 
 * @param {String}
 *            maxHeight The new max height constraint for the resize
 */
SweetDevRia.Grid.prototype.setMaxHeight = function (maxHeight) {
	this.maxHeight = parseInt(maxHeight, 10);
};

/**
 * Set the new min minWidth constraint for the resize
 * 
 * @param {String}
 *            minWidth The new min width constraint for the resize
 */
SweetDevRia.Grid.prototype.setMinWidth = function (minWidth) {
	this.minWidth = parseInt(minWidth, 10);
};

/**
 * Set the new max width constraint for the resize
 * 
 * @param {String}
 *            maxWidth The new max width constraint for the resize
 */
SweetDevRia.Grid.prototype.setMaxWidth = function (maxWidth) {
	this.maxWidth = parseInt(maxWidth, 10);
};

/**
 * Set the constraintId. If this id is not null, the user won't be able to
 * resize the grid outside this container.
 * 
 * @param {String}
 *            constraintId The new container identifiant
 */
SweetDevRia.Grid.prototype.setConstraintId = function (constraintId) {
	this.constraintId = constraintId;
};


SweetDevRia.Grid.prototype.render = function (){
	SweetDevRia.startLog ("Log.Render_"+this.id, this);
	this.isInitialized = true;
	var container = this.getContainer ();
	if (container) {
		container.innerHTML = this.veloHead();
	}
	this.isInitialized = false;
	// Remplace la deeclaration CSS non prise en compte au deemarrage O_o
	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);
};


SweetDevRia.Grid.prototype.createOrUpdatePageBars = function () {
	for (var i = 0; i < this.pageBarIds.length; i++) {
		// Mantis 36
		this.createOrUpdatePageBar (this.pageBarIds [i], (i == 0) /*
																	 * first bar
																	 * is top
																	 * bar
																	 */);
	}
}

/**
 * @param pageBarId :
 *            id of page bar element to create or update
 * @param isTop :
 *            if 'true' the page bar is top page bar (Mantis 36)
 * @private
 */
SweetDevRia.Grid.prototype.createOrUpdatePageBar = function (pageBarId, isTop) {
	var pageBarContainer = document.getElementById (pageBarId+"_container");
	if(!this.isTreeGrid){
		this.pageNumber = Math.ceil (this.totalDataNumber / this.rowPerPage);
		if (this.pageNumber >= 1) {
		
			var pageBar = SweetDevRia.$ (pageBarId);
			if (pageBar == null) {
				pageBar = this.createPageBar (pageBarId, isTop); // Mantsi 36
			}

			pageBar.setVisibility (true);
			
			// if pagebar display "canChangeItemPerPage" select box or
			// "showTotalPageNumber" information
			// the pagePage should be always displayed even if page number is
			// lesser than 2.
			// Mantis 35
			pageBar.setAlwaysVisible(this.canChangeItemPerPage || this.showTotalPageNumber);

			pageBar.setPageNumber (this.pageNumber);
			pageBar.setActualPage (this.actualPage);
			
			pageBar.rowPerPage = this.rowPerPage;
			pageBar.totalDataNumber = this.totalDataNumber;
			
			pageBar.canChangeItemPerPage = this.canChangeItemPerPage;
		    pageBar.showTotalPageNumber = this.showTotalPageNumber;
		    pageBar.pageBarMode = this.pageBarMode;
				
			// by default, top bar is hidden
			pageBar.refresh ();
			
			// Hide page bar if it is not visible (Mantis 36)
			if ( ((isTop) ? this.topBarVisible : this.bottomBarVisible) ) {
				this.showPageBar(pageBarId);
			} else {
				this.hidePageBar(pageBarId);
			}
		}
		else {
			this.deletePageBar(pageBarId);
		}
	}
}



/**
 * Set the table data
 * 
 * @param {Array}
 *            data The new Table data
 */
SweetDevRia.Grid.prototype.setData = function (data) {
	if (this.beforeSetData (data)) {
	
		this.rowsLoaded = true;
		this.rowsLoading = false;
		this.data = data;
		this.groupedData = {};
		this.listRows = [];

		if (this.initialized) {

			// on ecrit le bloc de lignes
			var str =  this.getDataStr ();
			var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
			divBody.innerHTML = str;

			// SWTRIA-977
			if (this.height !== null) {
		       	var bodyHeight = this.getBodyHeight();
		       	if(bodyHeight){
			    	divBody.style.height = (bodyHeight) + "px";
				}
			}

			// je reinitialise le div englobant
			this.tableBody = SweetDevRia.DomHelper.get (this.id+"_"+SweetDevRia.Grid.BODY_TABLE);

			// mise e jour eventuelle de la page barre
			this.createOrUpdatePageBars (); // SWTRIA-1306

			// reset checkbox all
			var rowId =  this.getRowIdByIndex (this.getFirstVisibleIndex());
			// SWTRIA-1305
			this.setCheckbox (rowId, this.checkedRows.contains (rowId), this.rowSelectorType == SweetDevRia.Grid.ROW_SELECTOR_CHECKBOX);
			
			// synchronise le scrolling horizontal des header par rapport au
			// scrolling horizontal des colonnes
			this.synchronizeHeader();
			
			// evalue le js eventuel contenu dans les cellules de la grid
			SweetDevRia_Zone_evalJS(divBody);
			SweetDevRia.initCompNotInitialized ();
			
			// on met a jour les cellules editable car on a reecrit les cells
			this.updateEditable ();
			
			if(this.containsData()){
				var idTable = document.getElementById(this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
				this.rowsTable = idTable.getElementsByTagName("tr");
			}
			
			// SWTRIA-1115
			// on update la derniere colonne a la taille du header
			this.updateLastColumnSizeToHeaderSize();
			
			// rafraichit la bordure
			var frame =  this.getFrame();
			if (frame) {
				frame.refreshBorders();
			}

			this.testIfTopPageBarIfNeeded (); // SWTRIA-1306
		}

		this.fireEventListener (SweetDevRia.Grid.SET_DATA_EVENT, data);
		this.afterSetData (data);
		
        var item = document.getElementById(this.id + "_frame_border");
        if(item){ // Correction SWTRIA-988
        	item.onselectstart = null;
        	item.onselect = null;
        	item.ondblclick = null;
        }
		
		if (this.onSetData){
			this.onSetData.call(this, data);
		}

	}
};

SweetDevRia.Grid.prototype.setInitializedData =  function (_initializedData){
	this.initializedData = _initializedData;
}

/**
 * Return the html string representing the data zone
 * 
 * @return html string representing the data zone
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getDataStr = function () {
	var str = null;
	if(this.containsData()){
		if (this.groupBy && this.groupBy.length > 0) {
			this.groupingDataDescr = this.initGroupingData (this.data);
			str = [];
			// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
			str.push('<div id="',this.id,'_',SweetDevRia.Grid.BODY_TABLE,'">');
			for (var i = 0; i < this.groupingDataDescr.length; i++) {
				this.listRows.push(null);
				str.push(this.getRowBlocStr (i));
			}
			str.push('</div>');
			// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
			str = str.join('');
		}
		else {
			// SWTRIA-1206
			// si this.groupBy est vide on efface les anciennes donnees groupees
			this.groupingDataDescr = null;
			str = this.veloData();
		}
	}
	return str;
};

/**
 * Return the total number of columns
 * 
 * @return the total number of columns
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnNumber = function () {
	return this.columnNumber;
};

/**
 * Return the number of visible columns
 * 
 * @return the total number of visible columns
 * @type int
 */
SweetDevRia.Grid.prototype.getVisibleColumnNumber = function () {
	return this.visibleColumnNumber;
};

/**
 * Return the visible column by this position, ex : the third visible column is
 * ...
 * 
 * @param {int}
 *            pos the searched position
 * @return the visible column at this position
 * @type Column
 */
SweetDevRia.Grid.prototype.getVisibleColumnByPos = function (pos) {
	if (pos < 0 || pos >= this.visibleColumnNumber) {
		return null;
	}
	
	var col = this.getFirstVisibleColumn ();
	for (i = 1; i <= pos; i++) {
		col = this.getNextVisibleColumn (col);
	}
	
	return col;
};

/**
 * Return the visible index of this column. ex: this column is the third visible
 * cols
 * 
 * @param {String}
 *            colId The column id
 * @return the visible index of this column
 * @type int
 */
SweetDevRia.Grid.prototype.getVisibleIndexById = function (colId) {
	
	var col = this.getFirstVisibleColumn ();
	for (i = 0; i < this.visibleColumnNumber; i++) {
		if (col.id == colId) {
			return i;
		}
	
		col = this.getNextVisibleColumn (col);
	}
	
	return null;
};
/**
 * Return the first visible index in the data
 * 
 * @return the first visible index in the data
 * @type int
 */
SweetDevRia.Grid.prototype.getFirstVisibleIndex = function () {
	return 0;
};

/**
 * Return the last visible index in the data
 * 
 * @return the last visible index in the data
 * @type int
 */
SweetDevRia.Grid.prototype.getLastVisibleIndex = function () {
	if (this.groupBy && this.groupBy.length > 0) {
		if(!this.isTreeGrid){
			return Math.min (this.getVisibleRowNumber () - 1, this.rowPerPage);
		}
		else{
			return this.getVisibleRowNumber() - 1;
		}
	}
	else {
		if(!this.isTreeGrid){
			return Math.min (this.data.length - 1, this.rowPerPage);
		}
		else{
			return this.data.length - 1;
		}
	}
};
 
/**
 * Return the header text of the column. This method remove the header html
 * code, just return text.
 * 
 * @param {String}
 *            colId Column identifiant associated with the header
 * @return header text of the column. This method remove the header html code,
 *         just return text.
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getHeaderText = function (colId) {
	var res = null;
	var col = this.getColumn (colId);
	
	return col.header;
};

/**
 * Add a new column in the datagrid. This column is added at the last position.
 * 
 * @param {String}
 *            id Identifiant of this new column
 * @param {String}
 *            header Header text of this new column
 * @param {int}
 *            size Width of this new column
 * @param {boolean}
 *            ascendant Indicate if this column must be sorted. True indicate
 *            this column must be ascendant sorted, false descendant sorted and
 *            null if not sorted.
 * @param {boolean}
 *            visible Indicate if this column is visible
 * @param {boolean}
 *            resizable Indicate if this column will be resizable by the user
 * @param {boolean}
 *            sortable Indicate if this column will be sortable by the user
 * @param {boolean}
 *            hideable Indicate if this column will be hideable by the user
 * @param {boolean}
 *            editable Indicate if this column will be editable by the user
 */
SweetDevRia.Grid.prototype.addColumn = function (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable, editable) {
	if (this.beforeAddColumn (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable)) {
		
		this.addColumnAtPosition (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable, editable, this.columnNumber, this.columnNumber);
		
		this.afterAddColumn (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable);
	}
};

SweetDevRia.Grid.prototype.addColumnAtPosition = function (id, header, size, ascendant, sortOrder, visible, resizable, sortable, hideable, editable, initialPosition, position, formater, styleClass, style) {
// TODO before after
		if (visible == null) {visible = true;}
		if (!hideable) {visible = true;}

		if (this.isTreeGrid) { // no sort on an treegrid !!
			sortable = false;
		}

		if (this.groupBy && this.groupBy.contains(id)) {visible = false;}


		var widthInPercent = false;
		if (size.indexOf ("%") >= 0) {
			widthInPercent = true;
		}
		if (size.indexOf ("px") >= 0 || size.indexOf ("%") == -1) {
			size = SweetDevRia.DomHelper.parsePx (size);
		}
		
		var column = {"id" : id, "header" : header, "position": position, "initialPosition": initialPosition, "visible" : visible, "size" : size, "ascendant" : ascendant, "sortOrder" : sortOrder, 
				"editable" : editable,"sortable" : sortable, "resizable" : resizable, "hideable" : hideable, "widthInPercent":widthInPercent, "formater":formater, "styleClass":styleClass, "style":style};
		this.columns [id] = column;
		// SWTRIA-1222
		// la taille du tableau est fixee par avance
		this.columnsAtPosition[position] = column;

		if (visible) {
			this.visibleColumnNumber ++;
		}
				
		this.columnNumber ++;
};

SweetDevRia.Grid.prototype.setEditableProperties = function (colId, type, maskPattern, charPattern, maskMessage, charMessage, maskMessageType, charMessageType, formatter, listOptions) {
	var editProp = {};
	editProp.type = type;
	editProp.maskPattern = maskPattern;
	editProp.charPattern = charPattern;
	editProp.maskMessage = maskMessage;
	editProp.charMessage = charMessage; 
	editProp.maskMessageType = maskMessageType; 
	editProp.charMessageType = charMessageType; 
	editProp.formatter = formatter;
	editProp.listOptions = listOptions;
	
	var col = this.columns [colId];
	col.editProp = editProp; 
};

/**
 * Return the column id from its position
 * 
 * @param {int}
 *            position Position of the searched column id
 * @return the column id from its position
 * @type String
 */
SweetDevRia.Grid.prototype.getColumnIdAtPosition = function (position) {
   	var column =  this.columnsAtPosition [position];
	if (!column || column == "undefined" || (typeof(column)+"").toLowerCase() == "function") {
		return null;
	}
	
	return column.id;
};

/**
 * Return the column from its position
 * 
 * @param {int}
 *            position
 * @return the column from its position
 * @type Object
 */
SweetDevRia.Grid.prototype.getColumnAtPosition = function (position) {
	var colId = this.getColumnIdAtPosition (position);

	return this.getColumn (colId);
};

SweetDevRia.Grid.prototype.getVisibleColumnByIndex = function (position) {
	var col = this.getFirstVisibleColumn();
	
	for (var i = 0; i < this.visibleColumnNumber; i++) {
		if (i == position) {
			return col;
		}
		col =  this.getNextVisibleColumn (col);
	}
		
	return col;
};


/**
 * Find the column from this cellIndex
 * 
 * @param {int}
 *            cellIndex of the searched column
 * @return the column from this cellIndex
 * @type Object
 * @private
 */
SweetDevRia.Grid.prototype.getColumnWithCellIndex = function (cellIndex) {
	var cells = this.tableHead.rows[this.maxGroupDepth].cells;
	
	var header = cells [cellIndex];
	
	if (header && header.id && header.id.indexOf(this.headPrefix) == 0) { // If
																			// it's
																			// a
																			// header
																			// !!
		var colId = header.id.substring (this.headPrefix.length);
		var column = this.getColumn (colId);
		return column;
	}
	
	return null;
};


/**
 * Find this cellIndex from the column
 * 
 * @param {Column}
 *            column Column which we search the cellIndex
 * @return the cellIndex from the column
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getCellIndexOfColumn = function (column) {
	return this.getCellIndexFromPosition (column.position);
};

/**
 * Find the previous visible spliter
 * 
 * @param {int}
 *            the current position
 * @return the previous position
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousVisibleSpliterPosition = function (position) {
	while(--position>=0 && !this.getColumnAtPosition(position).visible){
		null;
	}
	return position;
};

/**
 * Find this cellIndex from the column position
 * 
 * @param {int}
 *            position Column position which we search the cellIndex
 * @return the cellIndex from the column
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getCellIndexFromPosition = function (position) {
	this.tableHead = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.HEAD_TABLE); // NIS
	var cells = this.tableHead.rows[this.maxGroupDepth].cells;
	
	var result = -1;
	var start = 1; // RAG
	
	// If checkboxes are displayed, we start at the position 2!
	if (this.displayCheckbox){
		start = 3; // RAG
	}

	for (var i = start; i < cells.length; i++) {
		var cell = cells [i];
		if (! YAHOO.util.Dom.hasClass(cell,"ideo-ndg-headSeparator") && ! YAHOO.util.Dom.hasClass(cell,"ideo-ndg-headSeparatorNoResize")) {
			result ++;
		}
		
		if (result == position) {
			return i;
		}
	}
	
	return null;
};

/**
 * Return the first row (tr tag), not grouping header
 * 
 * @return the first row (tr tag), not grouping header
 * @type tr
 * @private
 */
SweetDevRia.Grid.prototype.getFirstRow = function () {

	for (var i = 0 ; i < this.rowsTable.length; i++) {
		var row = this.rowsTable [i];
		if (! YAHOO.util.Dom.hasClass(row,"ideo-ndg-headerGroup")) {
			return row;
		}
	}

	return null;
};

/**
 * Return the first visible row (tr tag), not grouping header
 * 
 * @return the first visible row (tr tag), not grouping header
 * @type tr
 * @private
 */
SweetDevRia.Grid.prototype.getFirstVisibleRow = function () {
	for (var i = 0 ; i < this.rowsTable.length; i++) {
		var row = this.rowsTable [i];
		if (YAHOO.util.Dom.hasClass(row,"ideo-ndg-row") && row.style.display != "none") {
			return row;
		}
	}

	return null;
};

/**
 * Return the last visible row (tr tag), not grouping header or detail
 * 
 * @return the last visible row (tr tag), not grouping header or detail
 * @type tr
 * @private
 */
SweetDevRia.Grid.prototype.getLastVisibleRow = function () {
	// var rows = this.tableBody!=null?this.tableBody.rows:[];

	for (var i = this.rowsTable.length-1; i >=0; i--) {
		var row = this.rowsTable [i];
		if (YAHOO.util.Dom.hasClass(row,"ideo-ndg-row") && row.style.display != "none") {
			return row;
		}
	}

	return null;
};

/**
 * Return the column
 * 
 * @param {String}
 *            colId Identifiant of the searched column
 * @return the column from its identifiant
 * @type Object
 */
SweetDevRia.Grid.prototype.getColumn = function (colId) {
    var column =  this.columns [colId];
	if (!column || column == "undefined" || (typeof(column)+"").toLowerCase() == "function") {column =  null;}
	
	return column;
};

/**
 * Return the column position
 * 
 * @param {String}
 *            colId Identifiant of the searched column position
 * @return the column position
 * @type int
 */
SweetDevRia.Grid.prototype.getColumnPosition = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.position;
	}
	return null;
};			

/**
 * Return the column size
 * 
 * @param {String}
 *            colId Identifiant of the searched column size
 * @return the column size
 * @type int
 * @deprecated cf GridSize.js
 */
SweetDevRia.Grid.prototype.getColumnSize = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.size;
	}
	return null;
};

/**
 * Return the column visibility
 * 
 * @param {String}
 *            colId Identifiant of the searched column visibility
 * @return the column visibility
 * @type boolean
 */
SweetDevRia.Grid.prototype.getColumnVisibility = function(colId){
	var column = this.getColumn (colId);
	if (column) {
		return column.visible;
	}
	return null;
};

/**
 * Swap the column visibility. Hide the column if it's visible, else show it.
 * 
 * @param {String}
 *            colId Identifiant of the column to swap
 */
SweetDevRia.Grid.prototype.swapColumnVisibility = function(colId){
	var visibility = this.getColumnVisibility (colId);
	this.setColumnVisibility (colId, ! visibility);
};

/**
 * Refresh all columns visibilities. Hide all hiddens, show all visibles.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.refreshColumnVisibilities = function(){
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {
	 		this.setColumnVisibility (column.id, column.visible);
		}
	}
};

/**
 * Set the column visibility
 * 
 * @param {String}
 *            colId Identifiant of the column to set
 * @param {boolean}
 *            visibility the new visibility of the column
 */
SweetDevRia.Grid.prototype.setColumnVisibility = function(colId, visibility){
	
	// on ne peut pas rendre visible une colonne groupee
	if (visibility && this.groupBy && this.groupBy.contains(colId)) {
		return ;
	}
	
	if (this.beforeSetColumnVisibility (colId, visibility)) {
		
		// Stop recalculing 100%
		var col = this.getColumn (colId);
		if (col == null){
			return;
		}

		// srevel : on ne peut pas cacher une colonne qui n'est pas hideable
		if (!visibility && ! col.hideable){
			return;
		}
		
		var oldVisibility = col.visible; 
		
		if (oldVisibility != visibility) {
			// update menuitem check
			var menuItem = SweetDevRia.$ (this.id + "MenuItem"+colId);

			// the user can't hide the last visible column
			if (!visibility && this.visibleColumnNumber == 1) {
				menuItem.setChecked(true);
				return;	
			}

			if (menuItem && menuItem.setChecked && ! menuItem.disabled) {
				if (visibility) {
					SweetDevRia.DomHelper.addClassName(menuItem.view(),"ideo-mnu-check");
				}
				else {
					SweetDevRia.DomHelper.removeClassName(menuItem.view(),"ideo-mnu-check");
				}
			}
						
			if (visibility) {
				this.visibleColumnNumber ++;
			}
			else {
				this.visibleColumnNumber --;
			}

			col.visible = visibility;
		
			// SWTRIA-1206
			// pas besoin de timeout
			// on change la visibilite des elements de la colonnes
			this.setColumnElementsVisibility (colId, visibility);
			// et on resize les groupHeaders si necessaire
			this.updateGroupHeadersSize();
			
			// SWTRIA-1326
			this.updateHeadDivForScroll();
		}
		
		// Stop recalculing 100%
		this.toRecalculate = true;
		
		this.afterSetColumnVisibility (colId, visibility);
		
		
		if (visibility) {
			this.fireEventListener (SweetDevRia.Grid.SHOW_COL_EVENT, colId);

			if (this.onShowColumn){
				this.onShowColumn.call (this, colId);
			}
		}
		else {
			this.fireEventListener (SweetDevRia.Grid.HIDE_COL_EVENT, colId);

			if (this.onHideColumn){
				this.onHideColumn.call (this, colId);
			}
		}
	}
};


/**
 * Create a new spliter used to resize columns
 * 
 * @param {String}
 *            colId Column identifiant associated with this spliter
 * @private
 */
SweetDevRia.Grid.prototype.createSpliter = function(colId){
	// create header spliter objects to resize columns
	var spliterId = this.spliterPrefix + colId;

	var spliter = new SweetDevRia.VSpliter(spliterId, this.minColumnWidth);
	spliter.shift = true;
	spliter.onSplit = this.resizingColumn(this);
	spliter.onSplitStart = this.beforeResizingColumn(this);
	spliter.onSplitEnd = this.afterResizingColumn(this);

	spliter.onMouseUp = function(e) {
		this.onSplitEnd();		
	};
	spliter.width = SweetDevRia.Grid.SPLITER_SIZE;
	spliter.getPreviousNode = this.getPreviousNode(this);
	this.spliters.push(spliter);

};

/**
 * Reset spliters constraints
 * 
 * @private
 */
SweetDevRia.Grid.prototype.resetSpliters = function(){
	for(var i=0;i<this.spliters.length;i++){
		this.spliters[i].previousNode= null;
		this.spliters[i].resetConstraints ();
	}
};

/**
 * SWTRIA-1348
 * Nouvelle methode de calcul de la taille de grid
 * (sans parcourir toutes les colonnes)
 * @private
 */
SweetDevRia.Grid.prototype.getCentPercent= function(){
	
	var width = this.width;
	
	if (width && width.indexOf && width.indexOf('%') !== -1) {
		var percentWidth = parseFloat(width.split("%")[0]);
		var containerWidth = SweetDevRia.DomHelper.getWidth (this.getContainer());
		width = Math.round(percentWidth * containerWidth / 100);
		
		//SWTRIA-1348
		//le pourcentage ne sert que lors du premier calcul
		this.width = width;
	}
	else if (width && width.indexOf && width.indexOf('px') !== -1) {
		width = Math.round(parseFloat(width.split("px")[0], 10));
	}
	
	return width;

};

/**
 * Initialize the Grid contextual menu on the first right click. This method
 * must be called at the page load !!!
 * 
 * @private
 */
SweetDevRia.Grid.generateContextMenu = function(e, id){
	if(e == null) {
		e = event || window.event; // Pour IE6
	}
	
	//SWTRIA-1212 : pour IE6
	SweetDevRia.EditableManager.endEditables(null, SweetDevRia.$ (SweetDevRia.EditableManager.ID));

	var cMenu=SweetDevRia.$(id + "Menu");
	if(!cMenu && SweetDevRia.$(id)){
		SweetDevRia.$(id).createContextMenu(e);
		SweetDevRia.EventHelper.stopPropagation(e);
		cMenu=SweetDevRia.$(id + "Menu");
	}
	else{
		// SWTRIA-1118
		cMenu.show(e);
	}

	// SWTRIA-1109
	if(cMenu) {
		var theGrid	= SweetDevRia.$(id);
		
		var originalTarget = YAHOO.util.Event.getTarget(e);
		var currentTD;
		if(originalTarget.nodeName=="TD"){ // mettre en majuscule
			currentTD = originalTarget;
		} else {
			currentTD = originalTarget.parentNode;	// cas du NOBR
		}
		
		var colId = theGrid.getColBusinessId(currentTD);
		var rowId = theGrid.getRowBusinessId(currentTD);

		cMenu.currentCell = [rowId,colId];
	}	
	return false;
};

/**
 * Initialize the Grid. This method must be called at the page load !!!
 * 
 * @private
 */
SweetDevRia.Grid.prototype.initialize = function(){

	if (this.beforeInitialize ()) {

		this.initialized = true;
		this.initializing = true;
		
		this.ddArrow = SweetDevRia.DomHelper.get(this.ddArrowId);
		this.tableBody = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
		this.tableHead = SweetDevRia.DomHelper.get(this.id+"_"+SweetDevRia.Grid.HEAD_TABLE);

		//SWTRIA-1348 : code supprime
		
		var id = this.id;
		document.getElementById(this.id).oncontextmenu = function(e){return SweetDevRia.Grid.generateContextMenu(e,id); };
		
		if(!this.isTreeGrid){
			this.pageNumber = Math.ceil (this.totalDataNumber / this.rowPerPage);
		
			if (this.pageNumber > 1) {
				this.createOrUpdatePageBars (); // SWTRIA-1306
			}
		}
		
		var border = this.createFrame();
		if(!border.isNude()){
			border.contentId = this.id;
			border.resizeMode = (this.resizable==true)?SweetDevRia.Frame.RESIZE_MODE_SE:SweetDevRia.Frame.RESIZE_MODE_NONE;
			border.borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;
			border.showBorderOnOver = false;
			border.constraintId = this.constraintId;
			
			this.minWidth = this.getMinWidth();
			this.minHeight = this.getMinHeight();
		
			var table = this;
			border.getMinHeight = function () {return table.getMinHeight ();} ;
			border.getMaxHeight = function () {return table.getMaxHeight ();} ;
			border.getMinWidth = function () {return table.getMinWidth ();} ;
			border.getMaxWidth = function () {return table.getMaxWidth ();} ;
	
			var table = this;
			border.setWidth = function (width) {
				if (width < table.minWidth) width = table.minWidth;
				if (width >= 0) {
					table.setWidth (width);
					return true; 
				}
				
				return false;
			};
			border.setHeight = function (height) {
				if (height < table.minHeight) height = table.minHeight;
				if (height >= 0) {
					table.setHeight (height);
					return true; 
				}
				return false;
			};
			
			border.beforeResizing = function(){
				table.beforeResizing();
			};
			
			border.afterResizing = function(){
				table.afterResizing();
			};
		}
		// border.initialize ();

		if (this.displayCheckbox) {
			this.columnSizeSum += this.checkboxColWidth + SweetDevRia.Grid.SPLITER_SIZE;
		}
		
		this.setSelectionMode(this.selectionMode);

		//SWTRIA-1348 : code supprime

		var colNum = this.getColumnNumber ();
		for(var i = 0; i < colNum; i ++){
			var column = this.getColumnAtPosition (i);
			if (i < colNum - 1) {
				this.createSpliter (column.id);
		
				// initialize resizable column property (lock or unlock dragdrop
				// objects)
				this.setColumnResizable (column.id, column.resizable);
			}
		}
	
		// allow to drop headers on document.
	    var documentDropZone = new YAHOO.util.DDTarget("#document", this.id+"headers");

		if(this.displayCheckbox){
			this.columnSizeSum += this.checkboxColWidth;
		}

		for(var i = 0; i < colNum; i++){
			var column = this.getColumnAtPosition (i);
			if (column.visible) {

				var columnSize = column.size;
				this.columnSizeSum += this.convertToPx(columnSize);

				//SWTRIA-1348
				if (i < colNum - 1) {
					this.columnSizeSum += SweetDevRia.Grid.SPLITER_SIZE; // +2 because of spliter width
				}
				else{
					//pour la derniere colonne
					//il faut compenser l'eventuel arrondi du au pourecentage
					var diff = this.columnSizeSum - this.getGridWidth();
					if(diff > 0 && diff <= 2){
						column.size -= diff;
						this.columnSizeSum -= diff;
						this.updateColumnHeaderSize(column);
					} 
				}
			}

			// create header objects to move columns
		    var headerDD = new YAHOO.util.DragDrop(this.headPrefix + column.id, this.id+"headers");
			if (! this.isTreeGrid || i > 0) {// dans le treegrid, la premiere
												// colonne (celle du tree) n ets
												// pas draggable
		 		headerDD.onDragDrop = this.dropColumn(this);
			    headerDD.onDragOver = this.onDragColumn(this);
			}
			this.headerDDs[column.id] = headerDD;

			// active or desactive sortable property (header click action)
			this.setColumnSortable (column.id, column.sortable);

			// initialize column size property
			this.setColumnSize (column.id, column.size, true);
		}

		// initialize draggable columns property (lock or unlock dragdrop
		// objects)
		this.setDraggableColumns (this.draggableColumns);

		this.setWidth(this.width);
		
		this.setHeight(this.height);

		this.updateEditable ();
		
		var grid = this;
		SweetDevRia.addBeforeUnload(function(){
			grid.updateServerModel ();
		});

		this.initializing = false;
		
		var frame = this.getFrame();
		if (frame) {
			frame.refreshBorders();
		}
		
		// SWTRIA-1036
		// Detect if upper or lower bar should be visible.
		SweetDevRia.EventHelper.addListener (window, "resize", function () {
			grid.testIfTopPageBarIfNeeded ();			
		});
		
		this.afterInitialize ();

		this.isInitialized = true;

		this.loadRows();

	}

	return true;
};



/**
 * Load data rows of the current page into the table
 */
SweetDevRia.Grid.prototype.loadRows = function (){

	if (!(this.rowsLoaded || this.rowsLoading)) {
		var grid = this;
		this.rowsLoaded = false;
		this.rowsLoading = true;
		/* This AJAX call is done for performance reasons and nothing else. 
		 * The request serves to get a latent period that permit to run in parallel 
		 * the SweetDevRia.initCompNotInitialized function.
		 * For more information see the part "journal de travail" of http://ideo-club.ideotechnologies.com/browse/SWTRIA-1330 JIRA 
		 */
		SweetDevRia.ComHelper.asyncCallIAction("com.ideo.sweetdevria.taglib.grid.action.SetDataIAction", {"id":grid.id}, grid.setDataAsync);
	}
};


/**
 * Set the table width
 * 
 * @param {int}
 *            width The new table width
 */
SweetDevRia.Grid.prototype.setWidth = function (width){
	if (width && width < this.minWidth) width = this.minWidth;
	if (this.beforeSetWidth (width)) {
		// Start recalculing 100%
		// this.toCalculate = true;
		
		if (this.isInitialized && !this.resizable){
			return;
		}

		if (width == null) {
			var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
			var scrollerWidth = SweetDevRia.DomHelper.getScrollerWidth (divBody);
			width = (this.columnSizeSum + scrollerWidth) ; 
		}
		
		// SWTRIA-1115
		// on calcule la difference pour updater la derniere colonne si
		// necessaire
		if(this.width){
			// future largeur
			var futureWidth = this.getSize(width);
			// ancienne largeur
			var formerWidth = this.getGridWidth();
			// largeur minimale
			// SWTRIA-1206
			// seules les colonnes visibles doivent etre prisent en compte
			var minWidth = this.columnSizeSum + (this.visibleColumnNumber - 1)*SweetDevRia.Grid.SPLITER_SIZE;
			// on update la derniere colonne que si la largeur a ete ou sera
			// plus grande que la largeur minimale
			if(formerWidth > minWidth || futureWidth > minWidth){
				// la difference a ajouter a la derniere colonne (qui peut etre
				// negative)
				// est le minimum entre :
				// - la largeur de resize totale (futureWidth - formerWidth)
				// - la difference entre la future largeur et la taille minimale
				// (futureWidth - minWidth)
				var diff = Math.min(futureWidth - formerWidth, futureWidth - minWidth);
				this.updateLastColumnSize(diff);
				
				// SWTRIA-1206
				// on resize les groupHearders si necessaire
				this.updateGroupHeadersSize();
			}
		}
		
		if (width && width.indexOf && (width.indexOf ("%") > 0 || width.indexOf ("px") > 0)) {
			this.width = width;
		}
		else {
			this.width = width+"px";
		}

		if (this.initialized) {
			var table = SweetDevRia.DomHelper.get (this.id);

			table.style.width =  this.width;

			var frame = this.getFrame();
			if (frame && !frame.isNude()) {
				var border = frame.getMain();
				if (border) {
					// Si le cadre est actuellement en pourcentage, il doit
					// rester en pourcentage
					if (border.style.width && border.style.width.indexOf ("%") > 0) {
						
						// si width n est pas un pourcentage, on le convertit
						if (width && (! width.indexOf || width.indexOf ("%") == -1)) {

							var centPercent = SweetDevRia.DomHelper.getWidth (this.id+"_container");

							width = SweetDevRia.DomHelper.parsePx (width);

							this.width = (width * 100 / centPercent)+ "%";

						    table.style.width =  "100%";
						}
					}
					
					border.style.width =  this.width;
				}		
			}

			// SWTRIA-1115
			// update du headDiv si nécessaire
			this.updateHeadDivForScroll();
			

			this.setResizable(this.resizable);
		
			// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
			
		}
		
		// Stop recalculing 100%
		this.toRecalculate = true;
		
		this.afterSetWidth (width);
		
		this.fireEventListener (SweetDevRia.Grid.RESIZE_EVENT, [width, null]);

		if (this.onResize){
			this.onResize.call (this, width, null);
		}
	}
};

/**
 * Return the table height
 * 
 * @return table height
 * @type int
 */
SweetDevRia.Grid.prototype.getHeight = function (){
	return this.height;
};

/**
 * Return the table bottom bar height
 * 
 * @return table bottom bar height
 * @type int
 */
SweetDevRia.Grid.prototype.getBottomHeight = function (){
	if(this.pageNumber > 1 || this.showPropertyButton){
		var height = 0; // SWTRIA-977
		for (var i = 0; i < this.pageBarIds.length; i++) {
			var pageBar = SweetDevRia.DomHelper.get(this.pageBarIds [i]);
			var pageBarHeight = SweetDevRia.DomHelper.getHeight (pageBar);
			if (pageBarHeight) {
				height += pageBarHeight;
			}
			
		}
		return height; 
	}
	return 0;
};

/**
 * Get height of toolbars around the table
 * 
 * @return height of toolbars around the table
 * @type int
 */
SweetDevRia.Grid.prototype.getToolBarsHeight = function (){
	var topToolBar = SweetDevRia.DomHelper.get(this.topToolBarId);
	var bottomToolBar = SweetDevRia.DomHelper.get(this.bottomToolBarId);
	
	var totalHeight = 0;
	if(topToolBar){
		totalHeight += SweetDevRia.DomHelper.getHeight(topToolBar);
	}
	if(bottomToolBar){
		totalHeight += SweetDevRia.DomHelper.getHeight(bottomToolBar);
	}
	return  totalHeight;	
}

/**
 * Return the pagination bar height
 * 
 * @return the pagination bar height
 * @type Integer
 * @private
 */
SweetDevRia.Grid.prototype.getPageBarHeight = function (){
	var pageBarHeight = 0;
	// SWTRIA-977
	for (var i = 0; i < this.pageBarIds.length; i++) {
	   	// SWTRIA-1303
	   	// on ne cible que les PAGEBAR
	   	var pageBar = SweetDevRia.DomHelper.get (this.pageBarIds[i]);
	
		if (pageBar != null) {
			pageBarHeight += SweetDevRia.DomHelper.getHeight (pageBar);
		}
	}
	return pageBarHeight;
};

/**
 * Return the body height
 * 
 * @return the body height
 * @type Integer
 * @private
 */
SweetDevRia.Grid.prototype.getBodyHeight = function (){
	if (this.height) {

		if (this.height && (this.height+"").indexOf ("%") > 0) {
			this.height = SweetDevRia.DomHelper.getHeight (this.id);
		}		

		var height = SweetDevRia.DomHelper.parsePx (this.height);
		
		// SWTRIA-1303
		// les TOOLBARS comprennent les PAGEBAR et les boutons
		height = height - this.getHeightHeader() - this.getToolBarsHeight();
		
		return height; 
	}

	return null;
};

/**
 * Set the table height
 * 
 * @param {int}
 *            height The new table height
 */
SweetDevRia.Grid.prototype.setHeight = function (height){
	if (height && height < this.minHeight) height = this.minHeight;
	if (this.beforeSetHeight (height)) {
		if (! this.resizable){
			return;
		}
		this.height = height;
	
		if (this.initialized) {
			
			var frame = this.getFrame();
			if (frame && !frame.isNude()) {
				var border = frame.getMain();
				if (border) {
					// Si le cadre est actuellement en pourcentage, il doit
					// rester en pourcentage
					if (border.style.height && border.style.height.indexOf ("%") > 0) {
						
						// si height n est pas un pourcentage, on le convertit
						if (height && (! height.indexOf || height.indexOf ("%") == -1)) {

							var centPercent = SweetDevRia.DomHelper.getHeight (this.id+"_container");

							height = SweetDevRia.DomHelper.parsePx (height);

							this.height = (height * 100 / centPercent)+ "%";
						}
					}
					
					border.style.height =  this.height;
				}		
			}

			var table = SweetDevRia.DomHelper.get (this.id);
			
			if(this.height!==null && this.height!=='undefined'){
				table.style.height =  SweetDevRia.DomHelper.parsePx (this.height)+ "px";
			}

			var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	       	var bodyHeight = this.getBodyHeight();
	       	if(bodyHeight){
		    	divBody.style.height = bodyHeight + "px";
			}

			// SWTRIA-1115
			// resize du headDiv et
			// apparition ou disparition du div servant à remplir le overHeadDiv
		    this.updateHeadDivForScroll();

			this.setResizable(this.resizable);
	
			// SWTRIA-1206 : code supprime (plus de _noScrollDiv)
		}
		
		this.fireEventListener (SweetDevRia.Grid.RESIZE_EVENT, [null, height]);

		this.testIfTopPageBarIfNeeded ();
		
		this.afterSetHeight (height);
		
		if (this.onResize){
			this.onResize.call (this, null, height);
		}
	}
};


/**
 * Set the table size
 * 
 * @param {int}
 *            width The new table width
 * @param {int}
 *            height The new table height
 */
SweetDevRia.Grid.prototype.setSize = function(width, height){
	if (this.beforeSetSize (width, height)) {
		if (! this.resizable){
			return;
		}
		
		this.setHeight (height);
		
		this.setWidth (width);

		this.afterSetSize ();
	}
};

/**
 * Return the table width
 * 
 * @return table width
 * @type int
 */
SweetDevRia.Grid.prototype.getWidth = function (){
	return this.width;
};


/**
 * Return the minimum column width
 * 
 * @return minimum column width
 * @type int
 */
SweetDevRia.Grid.prototype.getMinColumnWidth = function (){
	return this.minColumnWidth;
};


/**
 * Set the minimum column width
 * 
 * @param {int}
 *            minColumnWidth The new minimum column width
 */
SweetDevRia.Grid.prototype.setMinColumnWidth = function (minColumnWidth){
	this.minColumnWidth = minColumnWidth;
};


/**
 * Return the table size
 * 
 * @return table size
 * @type Array
 */
SweetDevRia.Grid.prototype.getGridSize = function (){
	return [this.width,this.height] ;
};

/**
 * Return the header from a x position. This method is called during column
 * header drag drop.
 * 
 * @param {int}
 *            x X position
 * @return header from a x position. This method is called during column header
 *         drag drop.
 * @type HtmlElement
 * @private
 */
SweetDevRia.Grid.prototype.getHeaderFromX = function (x) {

	var previous = this.getFirstVisibleColumn();
	if (this.isTreeGrid) {
		previous = this.getNextVisibleColumn (previous);
	}
	var previousHeader = SweetDevRia.DomHelper.get (this.headPrefix+previous.id);

    for (var i = 0; i < this.visibleColumnNumber - 1; i ++) {
		var column = this.getNextVisibleColumn (previous);

		if (column && column.visible) {
			var headerCol = SweetDevRia.DomHelper.get (this.headPrefix+column.id); 
			var headerX = SweetDevRia.DomHelper.getX (headerCol);
			
			if (headerX > x) {
				return previousHeader;
			}
			else {
				previousHeader = headerCol;
				previous = column;
			}

		}
	}

	return previousHeader;
};

/**
 * This method put the dragdrop arrow at the good place according to header drag
 * position. It s called during column drag.
 * 
 * @param {Table}
 *            table Table component
 * @private
 */
SweetDevRia.Grid.prototype.onDragColumn = function(table){
	return function(e,id){
		var node = this.getEl();
		var target = SweetDevRia.DomHelper.get(id);

		var x = YAHOO.util.Event.getPageX(e);

		if (id == "#document") {
			target = table.getHeaderFromX (x); 
		}

		if (table.isTreeGrid && id == table.id+"_headColumn"+table.treeModelId) { 
			return ;
		}

		if (target) {
			SweetDevRia.DomHelper.addClassName( SweetDevRia.DomHelper.get(table.id+"_headTable"), "ideo-ndg-headDrag" );
		
		    var width = target.offsetWidth;
			var targetX = SweetDevRia.DomHelper.getX(target);
		    var offsetX = x - targetX;

			table.ddArrow.style.display = "block";
			table.ddArrow.style.top = "-"+SweetDevRia.DomHelper.getHeight (table.ddArrow)+ "px";
			
			var divBody = SweetDevRia.DomHelper.get (table.id+"_bodyDiv");
		    if(offsetX<width /2){
		        table.ddArrow.style.left = (target.offsetLeft - divBody.scrollLeft - 4) + "px";
		    }
		    else{
		        table.ddArrow.style.left = (target.offsetLeft - divBody.scrollLeft + width - 5) + "px";
		    }
		}
	};
};

/**
 * This method is called when the user drop a column
 * 
 * @param {Table}
 *            table Table component
 * @private
 */
SweetDevRia.Grid.prototype.dropColumn = function(table){
	return function(e,id){
		SweetDevRia.DomHelper.removeClassName( SweetDevRia.DomHelper.get(table.id+"_headTable"), "ideo-ndg-headDrag" );
	
 		table.ddArrow.style.display = "none";
	    var node = this.getEl();
	    var targetNode = SweetDevRia.DomHelper.get(id);

		var x = YAHOO.util.Event.getPageX(e);
		if (id == "#document") {
			targetNode = table.getHeaderFromX (x); 
		}

		if (table.isTreeGrid && id == table.id+"_headColumn"+table.treeModelId) { 
			return ;
		}

	    if (node == targetNode){
			return;
	    }
		
		// we search moved column position
		var movedId = node.id.substring (table.headPrefix.length);
		var movedCol = table.getColumn (movedId);
		var movedPosition = movedCol.position;

		var targetId = targetNode.id;
		var position = null;
		// If the target node is a spliter, we simulate a drop at the begining
		// of the next header
		if (targetId.indexOf (table.spliterPrefix) == 0) {
			var targetId = targetId.substring (table.spliterPrefix.length);
			var targetCol = table.getColumn (targetId);
			position = targetCol.position + 1;
		}
		else {
			var targetId = targetId.substring (table.headPrefix.length);
			var targetCol = table.getColumn (targetId);
			position = targetCol.position;
	
			// we search if the drop is before or after this target column
		    var width = targetNode.offsetWidth;
		    var targetX = SweetDevRia.DomHelper.getX(targetNode);
		    var offsetX = x - targetX;

		    if(offsetX >= width /2){				
				position ++;
		    }
		}

		if (movedPosition < position) {
		    if (position-1 == movedPosition){
				return;
		    }
		}
		else {
		    if (position == movedPosition){
				return;
		    }
		}

		table.setColumnPosition (movedId, position);

	};
};


/**
 * This method drop all datafrom a column position to another one
 * 
 * @param {String}
 *            id Identifiant of the html body table
 * @param {String}
 *            nodeId Moved column identifiant
 * @param {String}
 *            separatorId Moved spliter identifiant
 * @param {String}
 *            targetId Target column identifiant
 * @param {boolean}
 *            isLast Indicate if the target position is the last one
 * @private
 */
SweetDevRia.Grid.prototype.dropDataColumn = function(id,nodeId,separatorId,targetId,isLast){
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);
        var completeNodeId = this.id+"_cell_"+rowId+"_"+nodeId;
        var node = document.getElementById (completeNodeId);

        var completeSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+separatorId; 
    	var separator = document.getElementById (completeSeparatorId); 

        if(!isLast){
	        var completeTargetId = this.id+"_cell_"+rowId+"_"+targetId; 
	        var target = document.getElementById (completeTargetId); 

			// SWTRIA-1326
			// si on deplace la derniere colonne et qu'il avait des colonnes
			// invisibles juste avant
			// on redonne la visibilite au separator et cache le futur dernier
			if(separator.style.display == "none"){
				separator.style.display = "";
				var lastVisibleColId = this.getLastVisibleColumn().id;
				var completeFutureLastVisibleSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+lastVisibleColId;
				var futureLastVisibleSeparator = document.getElementById (completeFutureLastVisibleSeparatorId);
				futureLastVisibleSeparator.style.display = "none";
			}

            node = node.parentNode.removeChild(node);
       		separator = separator.parentNode.removeChild(separator);    
       		                   
	        target.parentNode.insertBefore(node,target);
	       	target.parentNode.insertBefore(separator,target);                        
        }
        else{
            // SWTRIA-1326
            var completeSeparatorTargetId = this.id+"_cell_spliter_"+rowId+"_"+targetId; 
	        var separatorTarget = document.getElementById (completeSeparatorTargetId);
	        
            if(!separatorTarget){
            	// s'il n y a pas de colonnes invisibles apres la derniere
				// colonne visible
            	// on renomme le separator
            	separator.id = completeSeparatorTargetId;
            	// on l'insert
            	var completeTargetId =  this.id+"_cell_"+rowId+"_"+targetId;
            	var target = document.getElementById (completeTargetId);
            	SweetDevRia.DomHelper.insertAfter(target.parentNode,separator.parentNode.removeChild(separator),target);
            	// il devient le separatorTarget
            	separatorTarget = separator;
            }
            else{
            	// s'il y a des colonnes invisibles apres la derniere colonne
				// visible
            	// on insert le separator
            	SweetDevRia.DomHelper.insertAfter(separatorTarget.parentNode,separator.parentNode.removeChild(separator),separatorTarget)
            	// on lui enleve la visibilite
            	separator.style.display = "none";
            	// et on redonne la visibilite a l'ancien
            	separatorTarget.style.display = "";
            }
	        // et on insert le node
	        SweetDevRia.DomHelper.insertAfter(separatorTarget.parentNode,node.parentNode.removeChild(node),separatorTarget);
        }
	}		
};


/**
 * Synchronize the scroll position between header and body.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.synchronizeHeader = function (){
	// SWTRIA-1314
	SweetDevRia.DomHelper.get(this.id+"_headDiv").scrollLeft = SweetDevRia.DomHelper.get (this.id+"_bodyDiv").scrollLeft;
};

SweetDevRia.Grid.prototype.getPreviousNode = function(table){
	return function(){
	    if(this.previousNode === null) {
			var previousTd = this.getNode().previousSibling;

			while(previousTd.nodeType == 3 || (previousTd.tagName && (previousTd.tagName.toLowerCase() != "td" || table.testHeaderVisibilty (previousTd) != true))) {
				previousTd = previousTd.previousSibling;
			}

			this.previousNode = previousTd;

			// si on trouve un previsousnode, on doit retourner le tag col
			// associe
			if (this.previousNode) {
				var colId = this.previousNode.id.substring (table.headPrefix.length);
				var column = table.getColumn (colId);
    			this.previousNode = SweetDevRia.DomHelper.get (table.id+"_head_col_"+column.position); 
			}
		}

		return this.previousNode;
	};
};




/**
 * Test the header visiblity
 * 
 * @param {HtmlElement}
 *            node Header to test
 * @return true is the node is visible, false else.
 * @type boolean
 * @private
 */
SweetDevRia.Grid.prototype.testHeaderVisibilty = function (node) {
	if (node && node.id && node.id.indexOf(this.headPrefix) == 0) { // If it's a
																	// header !!
		var colId = node.id.substring (this.headPrefix.length);
		var column = this.getColumn (colId);
		if (column) {
			var headerCol = SweetDevRia.DomHelper.get (this.id+"_head_col_"+column.position); 
			var visibility = this.testElementVisibility (headerCol);

			return visibility;
		}
	}

	return null; 
};

/**
 * return the next cell of html table
 * 
 * @param {HtmlTd}
 *            td Cell which we search the next
 * @private
 */
SweetDevRia.Grid.prototype.getNextCell = function(td){
    if(td.cellIndex<(td.parentNode.cells.length-1)){
        return td.parentNode.cells[td.cellIndex+1];		
	}
    else{
		return null;
	}
};
  
/**
 * return the previous cell of html table
 * 
 * @param {HtmlTd}
 *            td Cell which we search the previous
 * @private
 */          
SweetDevRia.Grid.prototype.getPreviousCell = function(td){
	if(td.cellIndex>0){
	    return td.parentNode.cells[td.cellIndex-1];		
	}
	else{
		return null;
	} 
}; 

/**
 * Return the selection mode of the table
 * 
 * @return selection mode of the table
 * @type int
 */ 
SweetDevRia.Grid.prototype.getSelectionMode = function(){
	return this.selectionMode;
};

/**
 * Set the selection mode of the table
 * 
 * @param {int}
 *            mode New selection mode. Possible valus are
 *            SweetDevRia.Grid.NO_SELECTION, SweetDevRia.Grid.ROW_SELECTION,
 *            SweetDevRia.Grid.ROWS_SELECTION, SweetDevRia.Grid.CELL_SELECTION ,
 *            SweetDevRia.Grid.CELLS_SELECTION
 */
SweetDevRia.Grid.prototype.setSelectionMode = function(mode){
	if (this.beforeSetSelectionMode (mode)) {
		if (! this.initialized) {
			this.selectionMode = mode;
		}
		else {
			this.clearSelection();
			this.selectionMode = mode;
		
			if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
				this.selection = null;
			}
			else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
				this.selection = [];
			}
		}	

		this.afterSetSelectionMode (mode);
	}
};

/**
 * Return the total data number of the table
 * 
 * @return the total data number of the table
 * @type int
 */ 
SweetDevRia.Grid.prototype.getTotalDataNumber = function(){
	return this.totalDataNumber;
};

/**
 * Set the total data number of the table
 * 
 * @param {int}
 *            mode New total data number of the table
 */
SweetDevRia.Grid.prototype.setTotalDataNumber = function(total){
	if (this.beforeSetTotalDataNumber (total)) {
		// TODO some init ?
		this.totalDataNumber = total;
		this.afterSetTotalDataNumber (total);
	}
};

/**
 * Return the displayCheckbox property
 * 
 * @return true if checkboxes are displayed, else false
 * @type boolean
 */ 
SweetDevRia.Grid.prototype.getDisplayCheckbox = function(){
	return this.displayCheckbox;
};

/**
 * Set the displayCheckbox property
 * 
 * @param {boolean}
 *            displayCheckbox True if checkboxes must be displayed, else false
 */
SweetDevRia.Grid.prototype.setDisplayCheckbox = function(displayCheckbox){
	this.displayCheckbox = displayCheckbox;
};

/**
 * Return the value of the html checkbox component which check all checkboxes
 * 
 * @return true if the checkbox component is checked, flase else, or null if
 *         this checkbox doesn't exist
 * @type boolean
 */
SweetDevRia.Grid.prototype.getCheckboxAll = function(){
	var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
	if (checkboxAll) {
		return checkboxAll.checked;
	}
	
	return null;
};

/**
 * Return the value of the html checkbox component associated with one row
 * 
 * @param {int}
 *            rowId Row identifiant
 * @return true if the checkbox component is checked, flase else, or null if
 *         this checkbox doesn't exist
 * @type boolean
 */
SweetDevRia.Grid.prototype.getCheckbox = function(rowId){
	var checkbox =  SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");
	if (checkbox) {
		return checkbox.checked;
	}
	
	return null;
};

/**
 * Check or uncheck the html checkbox component which check all checkboxes
 * 
 * @param {boolean}
 *            select True to select the checkbox, else false
 */
SweetDevRia.Grid.prototype.setCheckboxAll = function (select){
	if (this.beforeSetCheckboxAll (select)) {
		
		if (! this.displayCheckbox){
			return;
		}
		
		var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
		checkboxAll.checked = select;

		for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
			var rowId =  this.getRowIdByIndex (i);
			this.setCheckbox (rowId, select, false);
		}
		
		if(this.groupBy){
			for(var i = 0; i<this.groupingDataDescr.length;i++){
				this.setCheckboxGroupU(select,i);
			}
		}
		
		this.afterSetCheckboxAll (select);
	}
};

SweetDevRia.Grid.prototype.setCheckboxGroupU = function (select, blocDescrIndex){
	if (this.beforeSetCheckboxAll (select)) {
		if (! this.displayCheckbox){
			return;
		}
		var checkboxGroup = SweetDevRia.DomHelper.get (this.id+"_col_checkboxGroup"+blocDescrIndex+"-"+this.actualPage);
		if (checkboxGroup && !checkboxGroup.disabled) {
			checkboxGroup.checked = select;
		
			if (select) {
				if (!this.checkedGroupRows.contains (blocDescrIndex+"-"+this.actualPage)) {
					this.checkedGroupRows.add (blocDescrIndex+"-"+this.actualPage);
				}
			}
			else {
				this.checkedGroupRows.remove (blocDescrIndex+"-"+this.actualPage);
			}
		}		
		
		
		var bloc = this.getRowsForBloc(blocDescrIndex);
		if (bloc){
			for (var iindex = 0; iindex < bloc.length; iindex++){
				var numIndex = bloc[iindex][0];
				var rowId =  numIndex;
				if(iindex<bloc.length-1){
					this.setCheckbox (rowId, select, false);
				}
				else{
					this.setCheckbox (rowId, select, true);
				}
			}
		}
		this.afterSetCheckboxAll (select);
	}
};


SweetDevRia.Grid.prototype.setCheckboxGroup = function (select,blocDescrIndex,evt){
	this.setCheckboxGroupU(select, blocDescrIndex);

	SweetDevRia.EventHelper.stopPropagation(evt);
	return false;
};



/**
 * Return the checked rows identifiants. The list is exhaustive and return also
 * the rows not loaded, which data are not present in the client.
 * 
 * @return checked rows identifiants
 * @type Array
 */
SweetDevRia.Grid.prototype.getCheckedRows = function(){
	return this.checkedRows;
};

SweetDevRia.Grid.prototype.getCheckedGroupRows = function(){
	return this.checkedGroupRows;
};


/**
 * Check or uncheck the html checkbox component associated with one row
 * 
 * @param {String}
 *            rowId row identifiant
 * @param {boolean}
 *            select True to select the checkbox, else false
 * @param {boolean}
 *            testAll True if the method must test if all checbox are checked to
 *            check the checkboxAll, else false
 */
SweetDevRia.Grid.prototype.setCheckbox = function(rowId, select, testAll){
	var originRowId = rowId;

	if (this.beforeSetCheckbox (rowId, select, testAll)) {
		if (! this.displayCheckbox){
			return;
		}
		
		if (testAll == null){
			testAll = true;
		}

		var checkbox = SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");

		if (checkbox && !checkbox.disabled) {

			checkbox.checked = select;
			
			if (select) {
				if (!this.checkedRows.contains (rowId)) {
					this.checkedRows.add (rowId);
				}
			}
			else {
				this.checkedRows.remove (rowId);
			}
			
		 	if (this.groupBy && this.groupBy.length > 0) {
				var dataGroupingId = this.getDataGroupingId(rowId);
				var data2 = this.data[dataGroupingId][1];
				var checkGroupRow = true;
				
				for(var i=0;i<data2.length;i++){
					var checkboxTmp = SweetDevRia.DomHelper.get(this.id+"_col_"+data2[i][0]+"_checkbox");
					if(!checkboxTmp.checked){
						checkGroupRow = false;
					}
				}
				
				var checkboxGroup = SweetDevRia.DomHelper.get (this.id+"_col_checkboxGroup"+dataGroupingId+"-"+this.actualPage);
				checkboxGroup.checked = checkGroupRow;
			}
		}

		// update checkboxAll value;
		if (testAll) {
			var checkboxAll = SweetDevRia.DomHelper.get (this.id+"_col_checkboxAll");
			if (select) {
				checkboxAll.checked = true;				
				for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
					var rowId =  this.getRowIdByIndex (i);
					var checkbox = SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");
					if(!checkbox.disabled && !this.getCheckbox (rowId)) {
						checkboxAll.checked = false;
						break;
					}
				}
			}
			else {
				checkboxAll.checked = false;
			}
		}
		
		this.afterSetCheckbox (rowId, select, testAll);
	}
	
	if (select) {
		this.fireEventListener (SweetDevRia.Grid.CHECK_ROW_EVENT, originRowId);

		if (this.onCheckRow){
			this.onCheckRow.call (this, originRowId);
		}
	}
	else {
		this.fireEventListener (SweetDevRia.Grid.UNCHECK_ROW_EVENT, originRowId);

		if (this.onUncheckRow){
			this.onUncheckRow.call (this, originRowId);
		}
	}
	
};


SweetDevRia.Grid.prototype.getDataGroupingId = function(rowId){
	if (this.groupBy && this.groupBy.length > 0) {
		for (var i = 0; i < this.data.length; i++) {
			var bloc = this.data[i][1];
			for(var j = 0; j < bloc.length; j++){
				if(bloc[j].contains(rowId)){
					return i;
				}
			}
		}
	}
	
	return null;
};



/**
 * return the row identifiant of the row at the rowIndex position
 * 
 * @param {Object}
 *            rowIndex
 * @return row identifiant of the row at the rowIndex position
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getRowIdByIndex = function(rowIndex){
	// SWTRIA-1206
	// lors du grouping le this.goupBy peut etre vide alors que les donnees
	// groupees sont
	// toujours affichees
	if (this.groupBy && this.groupingDataDescr) {
		var pos = 0;

		for (var i = 0; i < this.groupingDataDescr.length; i++) {
			var blocDescr = this.groupingDataDescr [i];
			var number = blocDescr [blocDescr.length-1];
			if (pos + number > rowIndex) {
				var rows = this.getRowsForBloc (i);
				var row = rows [pos + number - rowIndex - 1];
				return row [0];
			}
			else {
				pos += number;
			}
		}
	}
	else {
		var row = this.data [rowIndex];
		if (row) {
			return row [0];
		}	
	}

	return null;
};


SweetDevRia.Grid.prototype.updateRowDataWithForm = function(rowId, formId, mapping){
	var myForm = document.getElementById (formId);
	var rowData = SweetDevRia.Form.getFormData (myForm, mapping);

	this.updateRowData (rowId, rowData);
};

SweetDevRia.Grid.prototype.updateRowData = function(rowId, rowData){
	this.updateServerModel ();

	var params = {};
	params ["gridId"] =  this.id;

	params ["rowId"] = rowId;
	params ["rowData"] = rowData;

	SweetDevRia.showWaitingMessage (this.getMessage("updateRowWaiting"), "ideo-ndg-waitingMessage");

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateRowData", this.id, params));
	SweetDevRia.ComHelper.flushEvents ();
};

SweetDevRia.Grid.prototype.onUpdateRowData = function(evt){
	var rowId = evt.rowId;
	var rowData = evt.data;

	for(var colId in this.columns){
		var col = this.columns [colId];

		var cellValue = rowData [col.initialPosition + 1];

		this.updateCell (rowId, colId, cellValue);
	}

	SweetDevRia.hideWaitingMessage ();

	return true;
};


SweetDevRia.Grid.prototype.updateCellData = function(rowId, colId, cellData){
	this.updateServerModel ();

	var params = {};
	params ["gridId"] =  this.id;

	params ["rowId"] = rowId;
	params ["colId"] = colId;
	params ["cellData"] = cellData;

	SweetDevRia.showWaitingMessage (this.getMessage("updateCellWaiting"), "ideo-ndg-waitingMessage");
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateCellData", this.id, params));
	SweetDevRia.ComHelper.flushEvents ();
};

SweetDevRia.Grid.prototype.onUpdateCellData = function(evt){
	var rowId = evt.rowId;
	var colId = evt.colId;
	var cellData = evt.cellData;

	this.updateCell (rowId, colId, cellData);
	SweetDevRia.hideWaitingMessage ();

	this.fireEventListener (SweetDevRia.Grid.UPDATE_CELL_EVENT, [rowId, colId, cellData]);

	if (this.onUpdateCell){
		this.onUpdateCell (rowId, colId, cellData);
	}
	return true;
};


/**
 * @private
 */
SweetDevRia.Grid.prototype.getDisplayedCellValue = function(rowId, columnId, cellValue){
	var cellId = this.id+"_cell_"+rowId+"_"+columnId;

	var formattedValue = cellValue;

	var editCell = SweetDevRia.$ (cellId+"_edit");
	if (editCell) {
		formattedValue = editCell.formatEditValue (formattedValue);
	}

	return formattedValue;
};

/**
 * @private
 */
SweetDevRia.Grid.prototype.updateCell = function(rowId, columnId, cellValue){
	var cellId = this.id+"_cell_"+rowId+"_"+columnId;
	var cell = document.getElementById (cellId);

	if (cell) {
		var formattedValue = this.getDisplayedCellValue (rowId, columnId, cellValue);
		
		if (this.rowWrap == false) {
			cell.innerHTML = "";
			var nobr= document.createElement ("nobr");
			
			nobr.innerHTML = formattedValue;
			cell.appendChild(nobr);
		}
		else {
			cell.innerHTML = formattedValue;
		}
	}

	var rowData = this.groupedData [rowId];
	var col = this.getColumn (columnId);
	rowData [col.initialPosition + 1] = cellValue;

	this.groupedData [rowId] = rowData;

	// update this.data
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i][0] == rowId) {
			this.data[i] = rowData;
			break;
		}
	}
};



SweetDevRia.Grid.prototype.addRowDataWithForm = function(rowId, formId, mapping, index){
	var myForm = document.getElementById (formId);
	var rowData = SweetDevRia.Form.getFormData (myForm, mapping);
	
	this.addRowData (rowId, rowData, index);
};


SweetDevRia.Grid.prototype.addRowData = function(rowId, rowData, index){
	this.updateServerModel ();

	var params = {};
	params ["gridId"] =  this.id;
	params ["rowId"] = rowId;
	params ["index"] = index;
	params ["rowData"] = rowData;

	SweetDevRia.showWaitingMessage (this.getMessage("addRowWaiting"), "ideo-ndg-waitingMessage");

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("addRowData", this.id, params));
	SweetDevRia.ComHelper.flushEvents ();
};

SweetDevRia.Grid.prototype.onAddRowData = function(evt){
	this.totalDataNumber++;
	this.setData( evt.data );
	SweetDevRia.hideWaitingMessage ();

	this.fireEventListener (SweetDevRia.Grid.ADD_ROW_EVENT , [evt.rowId,evt.rowData]);

	if (this.onAddRow) {
		this.onAddRow (evt.rowId,evt.rowData);
	}
	return true;
};


SweetDevRia.Grid.prototype.deleteRowData = function(rowId){
	this.updateServerModel ();

	var params = {};
	params ["gridId"] =  this.id;
	params ["rowId"] = rowId;

	SweetDevRia.showWaitingMessage (this.getMessage("deleteRowWaiting"), "ideo-ndg-waitingMessage");

	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("deleteRowData", this.id, params));
	SweetDevRia.ComHelper.flushEvents ();
};

SweetDevRia.Grid.prototype.onDeleteRowData = function(evt){
	
	this.totalDataNumber --;

	this.checkedRows.remove(evt.rowId);

	this.setData( evt.data );

	SweetDevRia.hideWaitingMessage ();
	
	this.fireEventListener (SweetDevRia.Grid.DELETE_ROW_EVENT, evt.rowId);

	if (this.onDeleteRow){
		this.onDeleteRow (evt.rowId);
	}

	return true;
};

/**
 * return the row data contained in the grid for a specific rowId
 * 
 * @param {String}
 *            rowId
 * @return map a map with the column id as key and cell value as value. (
 *         {"colid":"cellvalue"} )
 * @type Map
 */
SweetDevRia.Grid.prototype.getRowData = function(rowId){
	var map = null;

	var rowData = this.groupedData[rowId];
	if (rowData) {
		map = {};
		for(var i=0;i<this.getColumnNumber();++i){
			var col = this.getColumnAtPosition(i);
			map[col.id] = rowData [col.initialPosition + 1];
		}
	}

	return map;

};

/**
 * Get the real row index from the visible row index
 * 
 * @param {HtmlRows}
 *            rows Set of html rows
 * @param {int}
 *            rowIndex visible row index
 * @return real row index from the visible row index
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getRowIndex = function(rows, row){
	var result = -1;
	for (var i = 0; i < rows.length; i++) {
		var rowCurrent = rows [i];
		if (! YAHOO.util.Dom.hasClass(rowCurrent,"ideo-ndg-detail")) {
			result ++;
		}

		if (rowCurrent == row) {
			return i;
		}
	}

	return -1;
};



/**
 * Set a row selection
 * 
 * @param {String}
 *            rowId Identifiant of the row to select or unselect
 * @param {boolean}
 *            select select the row if true, else unselect
 */
SweetDevRia.Grid.prototype.setRowSelection = function(rowId, select){
	if (this.beforeSetRowSelection (rowId, select)) {
		if (select){
			this.addRowSelection (rowId);
		}
		else {
			this.removeRowSelection (rowId);
		}
		
		this.afterSetRowSelection (rowId, select);
		
				
		if (select){
			this.fireEventListener (SweetDevRia.Grid.SELECT_ROW_EVENT, rowId);

			if (this.onSelectRow){
				this.onSelectRow.call (this, rowId);
			}
		}
		else {
			this.fireEventListener (SweetDevRia.Grid.UNSELECT_ROW_EVENT, rowId);

			if (this.onUnselectRow) {
				this.onUnselectRow.call (this, rowId);
			}
		}
			
	}
};

/**
 * Set a cell selection
 * 
 * @param {String}
 *            rowId Row identifiant of the cell's row to select or unselect
 * @param {String}
 *            columnId Column identifiant of the cell to select or unselect
 * @param {boolean}
 *            select Select the cell if true, else unselect
 */
SweetDevRia.Grid.prototype.setCellSelection = function(rowId, columnId, select){
	if (this.beforeSetCellSelection (rowId, columnId, select)) {
		if (select){
			this.addCellSelection (rowId, columnId);
		}
		else {
			this.removeCellSelection (rowId, columnId);
		}
		
		this.afterSetCellSelection (rowId, columnId, select);

		
		if (select){
			this.fireEventListener (SweetDevRia.Grid.SELECT_CELL_EVENT, [rowId, columnId]);

			if (this.onSelectCell) {
				this.onSelectCell.call (this, rowId, columnId);
			}
		}
		else {
			this.fireEventListener (SweetDevRia.Grid.UNSELECT_CELL_EVENT, [rowId, columnId]);

			if (this.onUnselectCell) {
				this.onUnselectCell.call (this, rowId, columnId);
			}
		}
	}
};

SweetDevRia.Grid.prototype.setHrefActive = function (active){
	SweetDevRia.DomHelper.get(this.id+"_activatorManager").focus();
	this.setActive(active);
};

SweetDevRia.Grid.prototype.getColumnEditable = function (colId){
	var column = this.getColumn (colId);
	return column.editable; 
};

SweetDevRia.Grid.prototype.setColumnEditable = function (colId, editable){
	var column = this.getColumn (colId);
	column.editable = editable;

	this.updateColumnEditable (colId);
};

SweetDevRia.Grid.prototype.updateColumnEditable = function (colId){
	var column = this.getColumn (colId);

	var headerEdit = SweetDevRia.DomHelper.get (this.headPrefix + colId+"_edit");

	// TODO le columnEditable est mal placee (sauf pour l'init)
	if (column && column.editable) {
	
		var rowsTR = SweetDevRia.DomHelper.getElementsByClassName ("ideo-ndg-row", "tr", this.id+"_"+SweetDevRia.Grid.BODY_TABLE);
		var length = rowsTR.length;
	
		for (var i = 0; i < length; i++) {			
			var row = rowsTR [i];
			var rowId = row.id.substring ( (this.id+"_tr_").length);

			var cellId = this.id+"_cell_"+rowId+"_"+colId;
			if (column.editable) {

				SweetDevRia.DomHelper.addClassName (headerEdit,"ideo-ndg-headerEditable");
				
				var editCell = SweetDevRia.$ (cellId+"_edit");
				
				// SWTRIA-1259 : cell have to be editable after sort or grouping
				var previousUpdated = false;
				var previousValue = null;
				if (editCell) {
					previousUpdated = editCell.updated;
					previousValue = editCell.value;
				}
				
				editCell = new SweetDevRia.Editable (cellId+"_edit");
				
				editCell.dateEditId = this.id+"_dateEdit"; // TODO a modifier
															// !!!!
					
				editCell.rowId = rowId;
				editCell.colId = colId;

				editCell.i18n ["title"]= this.i18n["title"];
				editCell.i18n ["invit"] = this.i18n["invit"];
				editCell.i18n ["empty"] = this.i18n["empty"];

				editCell.editClassName = null;

				editCell.targetId = cellId;
				editCell.type = column.editProp.type;
				editCell.maskPattern = column.editProp.maskPattern;
				editCell.charPattern = column.editProp.charPattern;
				editCell.maskMessage = column.editProp.maskMessage;
				editCell.charMessage = column.editProp.charMessage; 
				editCell.maskMessageType = column.editProp.maskMessageType; 
				editCell.charMessageType = column.editProp.charMessageType; 
				editCell.formatter = column.editProp.formatter;
				editCell.listOptions = column.editProp.listOptions;
					
				var grid = this;
				editCell.afterStartEdit = function () {
					var editComponent = this.getEditComponent ();

					if (this.type == SweetDevRia.Editable.DATE) {
						YAHOO.util.Event.removeListener(editComponent, "keydown", grid.editHandleEvent);
					}

					SweetDevRia.EventHelper.addListener(editComponent, "keydown", grid.editHandleEvent, [grid, this.rowId, this.colId]);
				};
				
				editCell.afterEndEdit = function () {
					if (this.updated) {
						grid.updateCellData (this.rowId, this.colId, this.value);
					}
				};
				
				editCell.render ();
				
				if (previousUpdated) {
					// SWTRIA-1259 : restore updated cells
					editCell.value = previousValue;
					editCell.updated = previousUpdated;
					var target = editCell.getTarget();
					if (target) editCell.addUpdatedStyle(target);
				}
				else {
					editCell.value = this.getCellValue (rowId, colId);
				}
				
				if (SweetDevRia.isInit) {
					// SWTRIA-1140
					// il faut appeler la methode d'initialisation globale
					SweetDevRia.initCompNotInitialized ();
				}
			}
			else {
				SweetDevRia.DomHelper.removeClassName (headerEdit,"ideo-ndg-headerEditable");

				var editCell = SweetDevRia.$ (cellId+"_edit");
				if (editCell) {
					var editComponent = editCell.getEditComponent ();
					YAHOO.util.Event.removeListener(editComponent, "keydown", this.editHandleEvent);
					
					editCell.destroy ();
				}
			}
		}
	}
};

SweetDevRia.Grid.prototype.updateEditable = function (){
    for (var colId in this.columns) {
		this.updateColumnEditable(colId); // SWTRIA-931
    }
};


SweetDevRia.Grid.prototype.editHandleEvent = function (evt, params) {
	var grid = params [0];
	var rowId = params [1];
	var columnId = params  [2]; 

	switch(evt.keyCode) {
		case SweetDevRia.KeyListener.TABULATION_KEY:
			var newCell = null;
			var shift = evt.shiftKey;
			if (shift) {
				newCell = grid.getNextEditableCell ([rowId, columnId], {"keyCode" : SweetDevRia.KeyListener.ARROW_LEFT_KEY}, true);
			}
			else {
				newCell = grid.getNextEditableCell ([rowId, columnId], {"keyCode" : SweetDevRia.KeyListener.ARROW_RIGHT_KEY}, true);
			}
			
			var cellId = grid.id+"_cell_"+newCell[0]+"_"+newCell[1];
			
			var newEdit = SweetDevRia.$(cellId+"_edit");
			if (newEdit) {
				newEdit.startEdit ();
			}
			
			SweetDevRia.EventHelper.stopPropagation (evt);
			SweetDevRia.EventHelper.preventDefault (evt);
			break;
		default :
			break;
	}
};

SweetDevRia.Grid.prototype.getCellValue = function (rowId, columnId){
	var rowData = this.groupedData [rowId];
	var col = this.getColumn (columnId);
	return rowData [col.initialPosition + 1];
};


/**
 * Method is called when the user click on a cell.
 * 
 * @param {Event}
 *            mouse clic event
 * @param {String}
 *            rowId Row identifiant of the clicked cell
 * @param {String}
 *            columnId Column identifiant of the clicked cell
 * @private
 */
SweetDevRia.Grid.prototype.onSelectCellEvt = function (evt, rowId, columnId){
	var col = this.getColumn (columnId);
	if (col && !col.editable) {
		var ctrl = evt.ctrlKey;
		var shift = evt.shiftKey;
	
		this.setHrefActive (true);
			
	   	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
		    this.setRowSelection(rowId, !this.isInSelection (rowId));
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
		    this.setCellSelection(rowId, columnId, !this.isInSelection ([rowId, columnId]));
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			if (shift) {
				if (this.firstShiftSelection == null){ 
					this.firstShiftSelection = this.lastSelectionAdded;
				}
				
				// we unselect old bloc
				this.selectRowBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
				
				// we select the new bloc
				this.selectRowBloc (rowId, this.firstShiftSelection, true);
	
				this.lastSelectionAdded = rowId;
			}
			else {
				this.firstShiftSelection = null;
				
				if(ctrl != true) {
					this.clearSelection ();
					this.setRowSelection(rowId, true);
				}
				else {
				    this.setRowSelection(rowId, !this.isInSelection (rowId));
				}
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			if (shift) {
				if (this.firstShiftSelection == null){ 
					this.firstShiftSelection = this.lastSelectionAdded;
				}
				// we unselect old bloc
				this.selectCellBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
				
				// we select the new bloc
				this.selectCellBloc ([rowId, columnId], this.firstShiftSelection, true );
	
				this.lastSelectionAdded = [rowId, columnId];
			}
			else {
				this.firstShiftSelection = null;
				
				if(ctrl != true) {
					this.clearSelection ();
					this.setCellSelection (rowId, columnId, true);
				}
				else {
				    this.setCellSelection(rowId, columnId, !this.isInSelection ([rowId, columnId]));
				}
			}
		}
		if(SweetDevRia.$(this.id + "Menu")){
			SweetDevRia.$(this.id + "Menu").hide();
		}
		
		// TT 534 : Allow the inner cell link clic
		SweetDevRia.DomHelper.clearSelection();
	}
	
};

/**
 * Test if a cell or a row is selected or not
 * 
 * @param {String |
 *            String[2]} obj rowId for a row test and [rowId, columnId] for a
 *            cell test
 * @return true if the cell or the row is selected, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.isInSelection = function(obj){
	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
		return obj == this.selection;
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		if (this.selection !== null) {
			return this.selection.contains (obj);
		}
		return false;
	}
	if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
		return ((this.selection!==null)&&(obj[0] == this.selection[0])&&(obj[1] == this.selection[1]));
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		if (this.selection !== null) {
		    for(var i=0;i<this.selection.length;i++){
		        if((this.selection[i][0] == obj[0])&&(this.selection[i][1] == obj[1])){
		            return true;
		        }
		    }
		}
		return false;
	}
	return null;
};

/**
 * Select a row
 * 
 * @param {String}
 *            rowId Row identfiant to select
 * @param {boolean}
 *            test Test if the row is alread in the selection
 * @private
 */
SweetDevRia.Grid.prototype.addRowSelection = function(rowId, test){

	if (test == null){
		test = true;
	}
	if (!test || ! this.isInSelection (rowId)) {
		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
		    if(this.selection !== null){
				this.removeRowSelection (this.selection);
		    }

		    this.selection = rowId;
		    var rowNode = document.getElementById (this.id+"_tr_"+this.selection);
			YAHOO.util.Dom.addClass(rowNode,"ideo-ndg-selection");

			this.lastSelectionAdded = rowId;
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			if (! this.selection.contains (rowId)) {
			    this.selection.add(rowId);
			}
		    var rowNode = document.getElementById (this.id+"_tr_"+rowId);
			YAHOO.util.Dom.addClass(rowNode,"ideo-ndg-selection");

			this.lastSelectionAdded = rowId;
		}
	}
};

/**
 * Unselect a row
 * 
 * @param {String}
 *            rowId Row identfiant to unselect
 * @private
 */
SweetDevRia.Grid.prototype.removeRowSelection = function(rowId){

	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
	    this.selection = null;
		var rowNode = document.getElementById (this.id+"_tr_"+rowId);
		YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
	    this.selection.remove(rowId);
		var rowNode = document.getElementById (this.id+"_tr_"+rowId);
		YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
	}
};

/**
 * Select a cell
 * 
 * @param {String}
 *            rowId Row identifiant of cell to select
 * @param {String}
 *            columnId Column Id of the cell to select
 * @param {boolean}
 *            test Test if the cell is alread in the selection
 * @private
 */
SweetDevRia.Grid.prototype.addCellSelection = function(rowId, columnId, test){
	if (test == null){
		test = true;
	}

	if (! test || ! this.isInSelection ([rowId, columnId])) {
		if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){

		    if(this.selection !== null){
				this.removeCellSelection (this.selection[0], this.selection[1]);
		    }

		    this.selection = [rowId, columnId];
			var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
			YAHOO.util.Dom.addClass(cellNode,"ideo-ndg-selection");

			this.lastSelectionAdded = this.selection;
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			if (! this.isInSelection ([rowId, columnId])) {
		   		this.selection.add([rowId, columnId]);
			}
			var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
			YAHOO.util.Dom.addClass(cellNode,"ideo-ndg-selection");

			this.lastSelectionAdded = [rowId, columnId];
		}
	}
};

/**
 * Unselect a cell
 * 
 * @param {String}
 *            rowId Row identifiant of cell to unselect
 * @param {String}
 *            columnId Column Id of the cell to unselect
 * @private
 */
SweetDevRia.Grid.prototype.removeCellSelection = function(rowId, columnId){
	if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
	    this.selection = null;
		var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
		YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
	}
	else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
	    for(var i=0;i<this.selection.length;i++){
	        if((this.selection[i][0] == rowId)&&(this.selection[i][1] == columnId)){
			    this.selection.remove(this.selection[i]);
	            break;
	        }
	    }

		var cellNode = document.getElementById (this.id+"_cell_"+rowId+"_"+columnId);
		YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
	}
};

/**
 * Clear all table selection
 */
SweetDevRia.Grid.prototype.clearSelection = function(){
	if (this.beforeClearSelection ()) {
		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION){
			if(this.selection !== null){
			    var rowNode = document.getElementById (this.id+"_tr_"+this.selection);
				YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
				this.selection = null;			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			if(this.selection && this.selection.length !== 0){
				for(var i=0;i<this.selection.length;i++){
				    var rowNode = document.getElementById (this.id+"_tr_"+this.selection[i]);
					YAHOO.util.Dom.removeClass(rowNode,"ideo-ndg-selection");
				}			
				this.selection = [];			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION){
			if(this.selection && this.selection.length !== 0){
				var cellNode = document.getElementById (this.id+"_cell_"+this.selection[0]+"_"+this.selection[1]);
				YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");			
				this.selection = null;			
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			if(this.selection && this.selection.length !== 0){
				for(var i=0;i<this.selection.length;i++){
					var cellNode = document.getElementById (this.id+"_cell_"+this.selection[i][0]+"_"+this.selection[i][1]);
					YAHOO.util.Dom.removeClass(cellNode,"ideo-ndg-selection");
				}			
				this.selection = [];			
			}
		}
		
		this.afterClearSelection ();
	}
};

/**
 * Return the table selection
 * 
 * @return table selection, rowId for row selection, [rowId, columnId] for cell
 *         selection
 * @type String | Array
 */
SweetDevRia.Grid.prototype.getSelection = function(){
	return this.selection;
};

/**
 * Set the resizable column property
 * 
 * @param {String}
 *            colId Column identifiant to set
 * @param {boolean}
 *            resizable New value of te resizable property. If true, te use will
 *            be able to resize this column, else not
 */
SweetDevRia.Grid.prototype.setColumnResizable = function(colId, resizable){
	if (this.beforeSetColumnResizable (colId, resizable)) {
		var column = this.getColumn (colId);
	
		if (column) {
			column.resizable = resizable;
	
			var spliterId = this.spliterPrefix + column.id;
		   	var spliter = SweetDevRia.$ (spliterId);
			var spliterElem = SweetDevRia.DomHelper.get (spliterId);
			
			if (spliter) {		
				if (! resizable) {
					spliter.lock ();
					SweetDevRia.DomHelper.removeClassName (spliterElem, "ideo-ndg-headSeparator");
					SweetDevRia.DomHelper.addClassName (spliterElem, "ideo-ndg-headSeparatorNoResize");
				}
				else {
					spliter.unlock ();
					
					SweetDevRia.DomHelper.addClassName (spliterElem, "ideo-ndg-headSeparator");
					SweetDevRia.DomHelper.removeClassName (spliterElem, "ideo-ndg-headSeparatorNoResize");
				}
			}
		}
		
		this.afterSetColumnResizable (colId, resizable);
	}
};

/**
 * Indicate if the user can drag columns or not
 * 
 * @return true if the user can drag columns, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.getDraggableColumns = function(){
	return this.draggableColumns;
};

/**
 * Set the draggableColumns property. This property indicate if the user can
 * drag columns or not
 * 
 * @param {boolean}
 *            draggable If true, the user can drag columns, else false
 */
SweetDevRia.Grid.prototype.setDraggableColumns = function(draggable){
	if (this.beforeSetDraggableColumns (draggable)) {
		this.draggableColumns = draggable;
		
		var colNum = this.getColumnNumber ();
	
		for(var i = 0; i < colNum; i ++){
			var column = this.getColumnAtPosition (i);
	
			if (column) {
				var headerDD = this.headerDDs[column.id];
				if (headerDD) {
					if (! this.draggableColumns || this.hasHeaderGroup) {
						headerDD.lock ();
					}
					else {
						headerDD.unlock ();
					}
				}
			}
		}
		
		this.afterSetDraggableColumns (draggable);
	}
};

/**
 * Set the sortable column property, This property indicate if the user can sort
 * this column or not
 * 
 * @param {String}
 *            colId Column to set
 * @param {boolean}
 *            sortable True if the user can sort this column, false if can't
 */
SweetDevRia.Grid.prototype.setColumnSortable = function(colId, sortable){
	if (this.beforeSetColumnSortable (colId, sortable)) {
		var column = this.getColumn (colId);
		if (column) {
			column.sortable = sortable;
	
			var header = SweetDevRia.DomHelper.get (this.headPrefix + column.id);
			if (header) {
				if (sortable) {
					var table = this;
					header.onclick = function () {
						table.sortColumn (column.id, column.ascendant ? false : true);
					};
				}
				else {
					header.onclick = null;
				}
			}
		}
		
		this.afterSetColumnSortable (colId, sortable);
	}
};

/**
 * Return the next column of this Grid. Be carefull, this method don't take into
 * account the visibility column property.
 * 
 * @see getNextVisibleColumn
 * @param {Column}
 *            col Reference Column which we search the next one
 * @return next column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getNextColumn = function(col){
	return this.getColumnAtPosition (col.position + 1);
};

/**
 * Return the previous column of this Grid. Be carefull, this method don't take
 * into account the visibility column property.
 * 
 * @see getPreviousVisibleColumn
 * @param {Column}
 *            col Reference Column which we search the previous one
 * @return previous column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousColumn = function(col){
	return this.getColumnAtPosition (col.position - 1);
};

/**
 * Return the next visible column of this Grid. Be carefull, this method take
 * into account the visibility column property.
 * 
 * @see getNextColumn
 * @param {Column}
 *            col Reference Column which we search the next one
 * @return next visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getNextVisibleColumn = function(col){
	for(var i=(col.position+1);i<this.columnNumber;i++){
		if(this.columnsAtPosition[i].visible){
			return this.columnsAtPosition[i];
		}
	}
	
	return null;
};

/**
 * Return the previous visible column of this Grid. Be carefull, this method
 * take into account the visibility column property.
 * 
 * @see getPreviousColumn
 * @param {Column}
 *            col Reference Column which we search the previous one
 * @return previous visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getPreviousVisibleColumn = function(col){
	var previousCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position < col.position && column.position > max) {
			max = column.position;
			previousCol = column;
		}
	}
	
	return previousCol;
};

/**
 * Return the last column
 * 
 * @return last column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getLastColumn = function(){
	var lastCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.position > max) {
			max = column.position;
			lastCol = column;
		}
	}
	
	return lastCol;
};

/**
 * Return the first column
 * 
 * @return first column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getFirstColumn = function(){
	var firstCol = null;
	var min = this.columnNumber;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.position < min) {
			min = column.position;
			firstCol = column;
		}
	}
	
	return firstCol;
};

/**
 * Return the last visible column
 * 
 * @return last visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getLastVisibleColumn = function(){
	var lastCol = null;
	var max = -1;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position > max) {
			max = column.position;
			lastCol = column;
		}
	}
	
	return lastCol;
};

/**
 * Return the first visible column
 * 
 * @return first visible column
 * @type Column
 * @private
 */
SweetDevRia.Grid.prototype.getFirstVisibleColumn = function(){
	var firstCol = null;
	var min = this.columnNumber;
    for (var colId in this.columns) {
		var column =this.columns [colId];
		if (column && column.visible && column.position < min) {
			min = column.position;
			firstCol = column;
		}
	}
	
	return firstCol;
};


/**
 * Return true if the table contains some data TT 458
 * 
 * @return true if the table contains some data
 * @type boolean
 */
SweetDevRia.Grid.prototype.containsData = function(){
	return (this.data.length!=0);
};

SweetDevRia.Grid.prototype.getColInColgroup = function(columnPosition){
	return SweetDevRia.DomHelper.get(this.id+"_head_col_"+columnPosition);
};

SweetDevRia.Grid.prototype.createCssRules=function(){
	var url=null;
	media=null;
	var ruleName="."+this.id+"_cellule_";
	var styles={'color': 'salmon','width': this.defaultRowSize+'px' };
	var declaration = '';

    // Build the declaration string from the style object
    for (property in styles) {
        if(!styles.hasOwnProperty(property)) { continue; }
        declaration += property + ':' + styles[property] + '; ';
    }

    var styleSheets = (typeof url == 'array' ? url : SweetDevRia.DomHelper.getStyleSheets(url,media));
	for(var colId in this.columns) {
		SweetDevRia.DomHelper.basicAddCSSRule(ruleName+colId, declaration, null ,styleSheets);
	}
};

/**
 * Set a column width
 * 
 * @param {String}
 *            colId Identifier of the column to resize
 * @param {int}
 *            size New width of the column
 * @param {boolean}
 *            true if initializing
 */
 SweetDevRia.Grid.prototype.setColumnSize = function(colId, size, initializing){
	

	if (this.beforeSetColumnSize (colId, size)) {
		// Start recalculing 100%
		// this.toCalculate = true;
		
		var column = this.getColumn (colId);

		if (column) {
			var centPercent = this.getCentPercent (); // 488
			
			// Compute the current column size (in pixels)
			var columnSize = this.convertToPx(column.size);
			
			// Compute the new column size (in pixels)
			var sizePx = this.convertToPx(size);

			// Compute the new sum of columns widths
			this.columnSizeSum = this.columnSizeSum - columnSize + sizePx; 

			// The new size of column is set
			column.size = size;
			// SWTRIA-1303 : code supprime puis reaparu lors du merge
		}
		
		// Stop recalculing 100%
		// this.toCalculate = false;
		this.toRecalculate = true;
		
		this.afterSetColumnSize (colId, size);
	}
};


/**
 * Rename a spliter. Used when the user move a column.
 * 
 * @param {String}
 *            colBeforeId Identifiant of the associated column before rename
 * @param {String}
 *            colId Identifiant of the associated column after rename
 * @private
 */
SweetDevRia.Grid.prototype.renameSeparator = function(colBeforeId, colId){
	var spliterId = this.spliterPrefix + colBeforeId;
	var spliter = SweetDevRia.$ (spliterId);

	// modify header spliter id
	var separator = SweetDevRia.DomHelper.get (spliterId);
	
	separator.setAttribute ("id", this.spliterPrefix + colId); 

	// modify rows spliter id
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);

        var oldSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+colBeforeId;
        var rowSeparator = document.getElementById (oldSeparatorId); 

        var newSeparatorId = this.id+"_cell_spliter_"+rowId+"_"+colId;
		rowSeparator.setAttribute ("id", newSeparatorId); 
	}

	// If it s the last column, we must replace the spliter component
	if (colBeforeId != colId) {
		// delete old spliter component
		if (spliter) {
			this.spliters.remove (spliter);
			// we unregister the old spliter dragdrop object
			spliter.unreg ();
			SweetDevRia.unregister (spliter);
		}
		
		// create a new spliter component
		this.createSpliter (colId);
	}


	this.resetSpliters ();
	
	return separator;
};

/**
 * Shift the column data in the columnsAtPosition list
 * 
 * @param {int}
 *            the position where the column is inserted
 * @param {int}
 *            the former column position
 * @Private
 */
SweetDevRia.Grid.prototype.shiftColumnsPosition = function(newPosition,oldPosition){
	var column = this.columnsAtPosition[oldPosition];
	this.columnsAtPosition.splice(oldPosition,1);
	this.columnsAtPosition.splice(newPosition,0,column);
};

/**
 * Shift the columns headers width in the table colgroup
 * 
 * @param {int}
 *            the position where the column is inserted
 * @param {int}
 *            the former column position
 * @Private
 */
SweetDevRia.Grid.prototype.shiftColumnsHeaderWidth = function(position,oldPosition,isLastPosition,wasLastPosition){	
	
	if(position == oldPosition){
		return;
	}	

	var oldHeader = SweetDevRia.DomHelper.get (this.id+"_head_col_"+oldPosition);
	var oldHeaderWidth = oldHeader.style.width;
	
	var futureLastVisibleColPosition;
	if(wasLastPosition){
		futureLastVisibleColPosition = (oldPosition >= this.visibleColumnNumber)?this.visibleColumnNumber-1:oldPosition;
		var futureLastVisibleCol = this.getVisibleColumnByPos(futureLastVisibleColPosition);
		futureLastVisibleColPosition = futureLastVisibleCol.position;
	}
	
	var nextOrPrevious = (oldPosition < position)?1:-1;
	for (var i = oldPosition; i != position; i = i + nextOrPrevious) {
		var beforeHeader = SweetDevRia.DomHelper.get (this.id+"_head_before_"+i);
		var header = SweetDevRia.DomHelper.get (this.id+"_head_col_"+i);
		var spliterHeader = SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+i);
		
		var nextOrPreviousHeader = SweetDevRia.DomHelper.get (this.id+"_head_col_"+(i + nextOrPrevious));
				
		if(nextOrPreviousHeader.style.width == "0px"){
			// si le prochain (ou precedent) header est celui d'une colonne
			// invisible
			this.setElementVisibility(beforeHeader,false);
			this.setElementVisibility(header,false);
			if(spliterHeader){
				this.setElementVisibility(spliterHeader,false);
			}
		}
		else{
			this.setElementVisibility(beforeHeader,true,1);
			this.setElementVisibility(header,true, this.getSize(nextOrPreviousHeader.style.width));
			if(spliterHeader){
				if(wasLastPosition){
					var nextOrPreviousSpliterHeader = SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+(i + nextOrPrevious));
					var visibility = (nextOrPreviousSpliterHeader.style.width != "0px");
					this.setElementVisibility(spliterHeader,visibility,this.getSize(nextOrPreviousSpliterHeader.style.width));
				}
				else{
					this.setElementVisibility(spliterHeader,true,2);
				}
			}
		}
	}
	
	var beforeHeader = SweetDevRia.DomHelper.get (this.id+"_head_before_"+i);
	var header = SweetDevRia.DomHelper.get (this.id+"_head_col_"+i);
	var spliterHeader = SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+i);
		
	var visibility = (oldHeaderWidth != "0px");
	if(visibility){
		this.setElementVisibility(beforeHeader,true,1);
		this.setElementVisibility(header,true, this.getSize(oldHeaderWidth));
		if(spliterHeader){
			if(isLastPosition){
				this.setElementVisibility(spliterHeader,false);
			}
			else{
				this.setElementVisibility(spliterHeader,true,2);
			}
		}
	}
	else{
		this.setElementVisibility(beforeHeader,false);
		this.setElementVisibility(header,false);
		if(spliterHeader){
			this.setElementVisibility(spliterHeader,false);
		}
	}
	
	if(wasLastPosition){
		this.setElementVisibility(SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+futureLastVisibleColPosition),false);
	}
};

/**
 * Shift the columns headers in the table
 * 
 * @param {int}
 *            the position where the column is inserted
 * @param {int}
 *            the former column position
 * @Private
 */
SweetDevRia.Grid.prototype.shiftColumnsHeader = function(colId,targetCol,isLastPosition){	
	
	// Swap header et spliter
	var node = SweetDevRia.DomHelper.get (this.headPrefix + colId);
	var separator = SweetDevRia.DomHelper.get (this.spliterPrefix + colId);
	var beforeNode = SweetDevRia.DomHelper.get (this.headBeforePrefix + colId);

	
	if(isLastPosition){
		var targetNode = SweetDevRia.DomHelper.get (this.spliterPrefix + targetCol.id);
		if(!targetNode){
			// il n'y a pas de colonnes invisibles apres targetCol
			// donc pas de spliter
			targetNode = SweetDevRia.DomHelper.get (this.headPrefix + targetCol.id);
			separator.id = this.spliterPrefix + targetCol.id;
			
			SweetDevRia.DomHelper.insertAfter(targetNode.parentNode,separator.parentNode.removeChild(separator),targetNode);
			targetNode = separator;
		}
		else{
			SweetDevRia.DomHelper.insertAfter(targetNode.parentNode,separator.parentNode.removeChild(separator),targetNode);
		}
		
		SweetDevRia.DomHelper.insertAfter(targetNode.parentNode,node.parentNode.removeChild(node),targetNode);
		SweetDevRia.DomHelper.insertAfter(targetNode.parentNode,beforeNode.parentNode.removeChild(beforeNode),targetNode);
		
	}
	else{
		var targetNode = SweetDevRia.DomHelper.get (this.headBeforePrefix + targetCol.id);
		
		targetNode.parentNode.insertBefore(beforeNode.parentNode.removeChild(beforeNode),targetNode); // NIS
      	targetNode.parentNode.insertBefore(node.parentNode.removeChild(node),targetNode);
        targetNode.parentNode.insertBefore(separator.parentNode.removeChild(separator),targetNode);
	}
	
};

/**
 * Set a column position
 * 
 * @param {String}
 *            colId Identifiant of the column to move
 * @param {int}
 *            position New position of the column
 */
SweetDevRia.Grid.prototype.setColumnPosition = function(colId, position){
	var column = this.getColumn (colId);
	
	// on en peut pas bouger une colonne cachee
	if (! column.visible) {
		return;	
	}

	if (this.beforeSetColumnPosition (colId, position)) {
		var column = this.getColumn (colId);
		var targetCol = this.getColumnAtPosition (position);
				
		if(targetCol && column.id==targetCol.id){
			return;
		}
		
		var lastVisibleCol = this.getLastVisibleColumn ();

		var targetId = null;
	
		var oldPosition = column.position;
		var oldPositionIndex = this.getCellIndexOfColumn (column);
		var separatorId = column.id;
		var positionIndex = this.getCellIndexFromPosition (position);

		var isLastPosition = false;
		var wasLastPosition = false;
		// If we drop the column at the last position
		if (position == lastVisibleCol.position + 1) {
			isLastPosition = true;
			targetCol = this.getColumnAtPosition (lastVisibleCol.position);
			targetId = targetCol.id;
		}
		else {
			targetId = targetCol.id;
		}

		// if we drag the last column
		if (column == lastVisibleCol) {
			// we search the previous column
			var colBefore = this.getPreviousColumn (column);

			var separator = SweetDevRia.DomHelper.get (this.spliterPrefix + colId);
			if(separator){
				// s'il y a une ou plusieurs colonnes invisibles apres la
				// colonne
				// on renomme temporairement le separator de column
				this.renameSeparator (colId, colId + "_temp");
			}
			
			// on renomme ensuite le separator de colBefore
			this.renameSeparator (colBefore.id, colId);
			
			if(separator){
				// et on renomme definitevement le separator de column
				this.renameSeparator (colId + "_temp",colBefore.id);
			}
			
			separatorId = colId;
			wasLastPosition = true;
			
			// SWTRIA-1326
			// le deplacement de la derniere colonne lui donne une nouvelle
			// largeur theorique
			column.size = this.getSize(this.getColInColgroup(oldPosition).style.width) + 1;
		}

		// update all column positions
		if (oldPosition < position) { 
			for (var i = oldPosition; i <= position-1; i++) {
				var col = this.getColumnAtPosition (i);
				col.position --;
			}
			column.position = position - 1;
		}
		else if (oldPosition > position){
			for (var i = oldPosition; i >= position; i--) {
				var col = this.getColumnAtPosition (i);
				col.position ++;
			}
	
			column.position = position;
		}
		
		// update the columnsAtPosition array
		this.shiftColumnsPosition(column.position,oldPosition);
		
		// SWTRIA-1326
		// shift sur les colGroup des colonnes
		this.shiftColumnsHeaderWidth(column.position,oldPosition,isLastPosition,wasLastPosition);

		// swap Data
		// shift sur les cellules des donnees
    	this.dropDataColumn(this.id+"_bodyTable", colId, separatorId, targetId, isLastPosition);                

		// STRIA-1326
		// shift sur les cellules des headers
		this.shiftColumnsHeader(colId,targetCol,isLastPosition);

		//SWTRIA-1361
		this.resetSpliters();

		this.afterSetColumnPosition (colId, position);
		
		this.fireEventListener (SweetDevRia.Grid.MOVE_COL_EVENT, [colId, position]);

		if (this.onMoveColumn){
			this.onMoveColumn.call (this, colId, position);
		}
	}
};


/**
 * Excel Export of rows
 * 
 * @param {int}
 *            exportMode Define if we export in wysiwyg mode or model mode.
 *            Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and
 *            SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array}
 *            exportdRowIds Array containing all exported row ids. If null, all
 *            rows will be exported.
 * @param {String}
 *            exportId String representing the id of the export being processed.
 */
SweetDevRia.Grid.prototype.excelExport = function(exportMode, exportRowIds, exportId){
	if (this.beforeExcelExport (exportMode, exportRowIds, exportId)) {

		this.updateServerModel ();

		SweetDevRia_exportExcel(exportId, exportMode, exportRowIds);

		this.afterExcelExport (exportMode, exportRowIds, exportId);
	}
};


/**
 * Execute a multiple column sort
 * 
 * @param {Array}
 *            grouping Contains all columns id to group by. exemple :
 *            ["col4","col1","col3"]
 */
SweetDevRia.Grid.prototype.groupingBy = function(grouping){
	if (this.beforeGroupingBy (grouping)) {

		SweetDevRia.showWaitingMessage (this.getMessage("groupingWaiting"), "ideo-ndg-waitingMessage");
		SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));

		this.updateServerModel ();
		
		var params = {"gridId" : this.id, "grouping" : grouping};
		
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("grouping", this.id, params));


		this.afterGroupingBy (grouping);
	}
};


/**
 * Execute a multiple column sort
 * 
 * @param {Array}
 *            columnsOrder Contains all columns order to sort.Each value is an
 *            array with the column id and the ascendant property. exemple :
 *            [["col4", true], ["col1", false], ["col3", true]]
 */
SweetDevRia.Grid.prototype.multipleColumnSort = function(columnsOrder){
	if (this.beforeMultipleColumnSort (columnsOrder)) {
		this.resetAllColumnSortClass ();

		var orders = [];

		if(columnsOrder.length == 0){
			SweetDevRia.log.error('No columns have been selected for multiple sort.');
			return;
		}
	
		for (var i = 0 ; i < columnsOrder.length; i++) {
			var colArr = columnsOrder [i];
			var colId = colArr [0]; 			
			var ascendant = colArr [1]; 	
	
			var col = this.getColumn (colId);
			this.setColumnSortClass (colId, ascendant);		
			col.ascendant = ascendant;
			col.sortOrder = i;
			var cellIndex = col.initialPosition;
	
			orders.add ([cellIndex, ascendant]);
		}

		SweetDevRia.showWaitingMessage (this.getMessage("multipleSortWaiting"), "ideo-ndg-waitingMessage");
		SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
		
		this.updateServerModel ();
		
		var params = {"gridId" : this.id, "orders" : columnsOrder};
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("sort", this.id, params));

		this.afterMultipleColumnSort (columnsOrder);
	}
};


/**
 * Reset All header column style
 * 
 * @private
 */
SweetDevRia.Grid.prototype.resetAllColumnSortClass = function(){
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {		
			this.setColumnSortClass (colId, null);
			column.ascendant = null;
			column.sortOrder = null;
		}
	}
};

/**
 * Refresh the header column style
 * 
 * @param {String}
 *            colId The column id to refresh
 * @param {boolean}
 *            ascendant True is the column must be ascendant sorted, false for
 *            descendant sorting
 * @param {boolean}
 *            mouseover Tells if the function is used to inverse temporarly the
 *            arrow
 * @private
 */
SweetDevRia.Grid.prototype.setColumnSortClass = function(colId, ascendant, mouseover){
	var column = this.getColumn (colId);
	if (! column.sortable) {
		return;
	}
		
	var headerSort = SweetDevRia.DomHelper.get (this.headPrefix + colId+"_sort");
	
	if(mouseover == true){
		if( !SweetDevRia.DomHelper.hasClassName (headerSort,"ideo-ndg-headerSortDesc") && !SweetDevRia.DomHelper.hasClassName (headerSort,"ideo-ndg-headerSortAsc") ){
			SweetDevRia.DomHelper.addClassName (headerSort,"ideo-ndg-headerSortable");
		}
	}
	else if(mouseover == false){
		if( !SweetDevRia.DomHelper.hasClassName (headerSort,"ideo-ndg-headerSortDesc") && !SweetDevRia.DomHelper.hasClassName (headerSort,"ideo-ndg-headerSortAsc") ){
			SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortable");
		}
	}
	else if (ascendant == true) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortDesc");
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortable");
		SweetDevRia.DomHelper.addClassName (headerSort,"ideo-ndg-headerSortAsc");
		var elem = SweetDevRia.DomHelper.getElementsByClassName(this.id+"_cellule_"+colId);
		for(var i=0; i<elem.length;i++){
			SweetDevRia.DomHelper.addClassName(elem[i],"ideo-ndg-headerCell");
		}
		
	}
	else if (ascendant == false) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortAsc");
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortable");
		SweetDevRia.DomHelper.addClassName (headerSort,"ideo-ndg-headerSortDesc");
		
		var elem = SweetDevRia.DomHelper.getElementsByClassName(this.id+"_cellule_"+colId);
		for(var i=0; i<elem.length;i++){
			SweetDevRia.DomHelper.addClassName(elem[i],"ideo-ndg-headerCell");
		}		
	}
	else if (ascendant == null) {
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortAsc");
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortDesc");
		SweetDevRia.DomHelper.removeClassName (headerSort,"ideo-ndg-headerSortable");
	}
};

/**
 * Refresh all checbox state. This method is called after a sort or a
 * pagination.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.refreshCheckboxes = function() {
	if (! this.displayCheckbox){
		return;
	}

	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);
		var checkbox =  SweetDevRia.DomHelper.get (this.id+"_col_"+rowId+"_checkbox");

		if (checkbox && this.checkedRows.contains (rowId)) {
			this.setCheckbox (rowId, true, i == this.getLastVisibleIndex());
		}
	}	
};

/**
 * Refresh all selection. This method is called after a sort or a pagination.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.refreshSelection = function() {
	for (var i = this.getFirstVisibleIndex() ; i <= this.getLastVisibleIndex(); i++) {
		var rowId =  this.getRowIdByIndex (i);

		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		    if(this.isInSelection (rowId)){
				this.addRowSelection (rowId, false);
				this.lastSelectionAdded = rowId;
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		    for (var colId in this.columns) {
				var column = this.getColumn (colId);
				if (column) {		
				    if(this.isInSelection ([rowId, colId])){
						this.addCellSelection (rowId, colId, false);
						this.lastSelectionAdded = [rowId, colId];
					}
				}
			}
		}
		
		this.firstShiftSelection = null;
	}
};

/**
 * Sort a column
 * 
 * @param {String}
 *            colId Identifiant of the column to sort
 * @param {boolean}
 *            ascendant True is the column must be ascendant sorted, false for
 *            descendant sorting
 */
SweetDevRia.Grid.prototype.sortColumn = function(colId, ascendant){

	if (this.beforeSortColumn (colId, ascendant)) {
		if (ascendant == null){
			ascendant = true;
		}
		
		
		
		
		var column = this.getColumn (colId);
		if (column) {
			this.resetAllColumnSortClass ();
			
			// we update the sort image
			this.setColumnSortClass (colId, ascendant);
			column.ascendant = ascendant;
			column.sortOrder = 0;
			
			// s'il n'y a pas de donnees, on n'affiche pas le waiting message
			SweetDevRia.showWaitingMessage (this.getMessage("sortWaiting"), "ideo-ndg-waitingMessage");
			SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
			
			this.updateServerModel ();

			var params = {"gridId" : this.id, "orders" : [[colId, ascendant, 0]]};
			
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("sort", this.id, params));

		}
		
		this.afterSortColumn (colId, ascendant);
		
	}
};


/**
 * This method is called on server grouping callback
 * 
 * @param {RiaEvent}
 *            evt Event containing data to displayed
 * @private
 */
SweetDevRia.Grid.prototype.onGrouping = function(evt) {

	// SWTRIA-1206
	// on rend visble les colonnes qui ne seront plus groupees
	var oldGrouping;
	if(this.groupBy){
		oldGrouping = this.groupBy;
	}
	else{
		oldGrouping = [];
	}
	this.groupBy = [];
	for (var i = 0 ; i < oldGrouping.length; i++) {
		var colId = oldGrouping[i];
		if(!evt.grouping.contains(colId)){
			var col = this.getColumn (colId);
			
			var menuItem = SweetDevRia.$ (this.id + "MenuItem"+colId);
			if (menuItem) {
				menuItem.setDisabled (false);
			}
	
			col.grouped = false;			
			this.setColumnVisibility (colId, true);
		}
	
	}

	this.groupBy = evt.grouping;
	// SWTRIA-1206
	// on fait le setData avec les colonne groupees toujours visibles
	this.setTooltips( evt.tooltips );
	this.setData( evt.data );
	
	// SWTRIA-1206
	// on rend invisble les colonnes qui seront groupees (apres le setData)
	for (var i = 0 ; i < this.groupBy.length; i++) {
		var colId = this.groupBy [i];
		var col = this.getColumn (colId);

		var menuItem = SweetDevRia.$ (this.id + "MenuItem"+colId);
		if (menuItem) {
			menuItem.setDisabled (true);
		}

		col.grouped = true;			

		this.setColumnVisibility (colId, false); 
	}
	
	// SWTRIA-1206
	// on resize les groupHeaders si necessaire
	this.updateGroupHeadersSize();
	// la hauteur des donnees peut changer donc on
	// update le dissimulateur du header en cas de scrollbarre
	this.updateHeadDivForScroll();

	this.refreshCheckboxes();
	this.refreshSelection ();

	SweetDevRia.hideWaitingMessage ();

	return true;

};


/**
 * This method is called on server sort callback
 * 
 * @param {RiaEvent}
 *            evt Event containing data to displayed
 * @private
 */
SweetDevRia.Grid.prototype.onSort = function(evt) {
	this.setTooltips( evt.tooltips );
	this.setData( evt.data );

	this.refreshCheckboxes();

	this.refreshSelection ();
	
	SweetDevRia.hideWaitingMessage ();

	this.fireEventListener (SweetDevRia.Grid.SORT_EVENT, evt.orders);

	if (this.onSortColumn){
		this.onSortColumn.call (this, evt.orders);
	}

	return true;
};

/**
 * Send all client grid information to the server to update the server model. Be
 * careful, this is a synchrone ajax call. This method is called before call
 * server side pagination, sort or excel export.
 * 
 * @param {boolean}
 *            fire Tell if the update should be send right away to the server
 */
SweetDevRia.Grid.prototype.updateServerModel = function(fireEvent){
	var params = {};
	params ["synchroCall"] = true;
	params ["gridId"] = this.id;

	// Iteration on columns to not send only parameters that need model
	params["columns"] = {};
	for( var i = 0; i < this.columnNumber; i++){
		var col = this.getColumnAtPosition(i);
		var column = {id : col.id, header : col.header, position: col.position, initialPosition: col.initialPosition, visible : col.visible, size : col.size, ascendant : col.ascendant, sortable : col.sortable, resizable : col.resizable, hideable : col.hideable};
		params["columns"][col.id] = column; 
	}

	params ["width"] = this.width+"";
	params ["height"] = this.height+"";
	params ["draggableColumns"] = this.draggableColumns;
	params ["resizable"] = this.resizable;
	params ["selectionMode"] = this.selectionMode;
	params ["selection"] = this.selection;
	params ["checkedRows"] = this.checkedRows;
	params ["actualPage"] = this.actualPage;
	params ["rowPerPage"] = this.rowPerPage; // SWTRIA-1307

	if(!fireEvent){
		SweetDevRia.ComHelper.stackEvent (new SweetDevRia.RiaEvent ("updateModel", this.id, params));
	}
	else{
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("updateModel", this.id, params));
	}
};

/**
 * Change the displayed page into table pagination
 * 
 * @param {int}
 *            actualPage New displayed page number
 * @see SweetDevRia.PageBar.prototype.goToPage
 */
SweetDevRia.Grid.prototype.goToPage = function(actualPage){
	if (this.beforeGoToPage (actualPage)) {
		this.actualPage = actualPage;
	
		SweetDevRia.showWaitingMessage (this.getMessage("paginationWaiting"), "ideo-ndg-waitingMessage");
		SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));
		
		this.updateServerModel ();

		var params = {};
		params ["gridId"] =  this.id;
		params ["actualPage"] = this.actualPage;
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("pagin", this.id, params));

		this.afterGoToPage (actualPage);
	}

};


/**
 * Change the number of item displayed per page
 * 
 * @param {int}
 *            new value of number of item displayed per page
 */
SweetDevRia.Grid.prototype.changeItemPerPage = function(itemPerPage) {
	if (this.beforeChangeItemPerPage (itemPerPage)) {	
		this.setRowPerPage(parseInt(itemPerPage));	
		this.goToPage(1);
		this.afterChangeItemPerPage (itemPerPage);
	}
}

SweetDevRia.Grid.prototype.getActualPage = function () {
	return this.actualPage;
};

SweetDevRia.Grid.prototype.getPageNumber = function () {
	return this.pageNumber;
};

/**
 * This method is called on server pagination callback
 * 
 * @param {RiaEvent}
 *            evt Event containing data to displayed
 * @private
 */
SweetDevRia.Grid.prototype.onPagin = function(evt) {

	this.setTooltips( evt.tooltips );	
	this.setData( evt.data );

	this.refreshCheckboxes();
	this.refreshSelection ();

	SweetDevRia.hideWaitingMessage ();

	this.fireEventListener (SweetDevRia.Grid.CHANGE_PAGE_EVENT,this.actualPage);

	if (this.onChangePage){
		this.onChangePage.call (this, this.actualPage);
	}
	return true;
};

/**
 * Return the header height
 * 
 * @return header height
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getHeightHeader = function (){
	var headTable = SweetDevRia.DomHelper.get(this.id+"_headTable");
	var headTableHeight = SweetDevRia.DomHelper.getHeight (headTable);
	if (!headTableHeight) {
		headTableHeight = 0;
	}
	return headTableHeight;
};

/**
 * Set the header height
 * 
 * @param {int}
 *            heightHeader The new header height
 * @private
 */
SweetDevRia.Grid.prototype.setHeightHeader = function (heightHeader){
	this.heightHeader = heightHeader;
};

/**
 * Return the default row height
 * 
 * @return row height
 * @type int
 * @private
 */
SweetDevRia.Grid.prototype.getHeightRow = function (){
	return this.heightRow;
};

/**
 * Set the default row
 * 
 * @param {int}
 *            heightRow The new default row height
 * @private
 */
SweetDevRia.Grid.prototype.setHeightRow = function (heightRow){
	this.heightRow = heightRow;
};


/**
 * Set the row number per page
 * 
 * @param {int}
 *            rowPerPage Row number per page. Default is 50.
 * @private
 */
SweetDevRia.Grid.prototype.setRowPerPage = function (rowPerPage){
	this.rowPerPage = rowPerPage;
};



/**
 * Indicate if the table is resizable or not.
 * 
 * @return true if the user can resize table, else false
 * @type boolean
 */
SweetDevRia.Grid.prototype.getResizable = function (){
	return this.resizable;
};

/**
 * Set the resizable property. This method hide or show the resizer
 * 
 * @param {boolean}
 *            resizable True if the ser can resize the table, else false
 */
SweetDevRia.Grid.prototype.setResizable = function (resizable){
	if (this.beforeSetResizable (resizable)) {
		this.resizable = resizable;
		if(this.getFrame()){
			var frame =  this.getFrame();
			if(!frame.isNude()){
				frame.resizeMode = (this.resizable==true)?SweetDevRia.Frame.RESIZE_MODE_SE:SweetDevRia.Frame.RESIZE_MODE_NONE;
				if (frame.initialized) {
					frame.refreshBorders();
				}
			}
		}
		this.afterSetResizable (resizable);
	}
};

/**
 * Switch bar visibility pageBarId id of the page bgar (top or bottom). ID =
 * [GRID ID]+"_"+SweetDevRia.Grid.PAGEBAR+ ("_top" | "_bottom")
 * 
 * @private
 */
SweetDevRia.Grid.prototype.switchPageBarVisibility = function(pageBarId){
	SweetDevRia.DomHelper.swapVisibility (pageBarId + "_container");
	
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	if (!divBody) return; // Mantis 33
    var bodyHeight = this.getBodyHeight();
    if(bodyHeight){
		divBody.style.height = bodyHeight + "px";
	}
}

/**
 * Turn bar visibility on pageBarId id of the page bgar (top or bottom). ID =
 * [GRID ID]+"_"+SweetDevRia.Grid.PAGEBAR+ ("_top" | "_bottom")
 * 
 * @private
 */
SweetDevRia.Grid.prototype.showPageBar = function(pageBarId){
	SweetDevRia.DomHelper.show (pageBarId + "_container");
	
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	if (!divBody) return; // Mantis 33
    var bodyHeight = this.getBodyHeight();
    if(bodyHeight){
		divBody.style.height = bodyHeight + "px";
	}
}

/**
 * Turn bar visibility off pageBarId id of the page bgar (top or bottom). ID =
 * [GRID ID]+"_"+SweetDevRia.Grid.PAGEBAR+ ("_top" | "_bottom")
 * 
 * @private
 */
SweetDevRia.Grid.prototype.hidePageBar = function(pageBarId){
	SweetDevRia.DomHelper.hide (pageBarId + "_container");
	
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	if (!divBody) return; // Mantis 33
    var bodyHeight = this.getBodyHeight();
    if(bodyHeight){
		divBody.style.height = bodyHeight + "px";
	}
}

/**
 * Create the pagination bar.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createPageBar = function(pageBarId, isTop){
	
	var container = document.getElementById (pageBarId+"_container");
	if (container) {
		var pageBar = SweetDevRia.$ (pageBarId);
		
		if(pageBar==null){
			pageBar = new SweetDevRia.PageBar (pageBarId);	
			
			pageBar.renderFrame = false;
			// SWTRIA-1306
			pageBar.template = (isTop)? this.templateTopPageBar : this.templateBottomPageBar;
		
			pageBar.setPageNumber (this.pageNumber);
			pageBar.setActualPage (this.actualPage);
			
			pageBar.setLinkedId (this.id);
			container.style.display = "";
			
      		// debut SWTRIA-987
			pageBar.i18n["item"] 			= this.i18n["item"];
			pageBar.i18n["firstTitle"] 		= this.i18n["firstTitle"];
			pageBar.i18n["prevTitle"] 		= this.i18n["prevTitle"];
			pageBar.i18n["nextTitle"] 		= this.i18n["nextTitle"];
			pageBar.i18n["lastTitle"] 		= this.i18n["lastTitle"];
			pageBar.i18n["noFirstTitle"]	= this.i18n["noFirstTitle"];
			pageBar.i18n["noPrevTitle"] 	= this.i18n["noPrevTitle"];
			pageBar.i18n["noNextTitle"] 	= this.i18n["noNextTitle"];
			pageBar.i18n["noLastTitle"] 	= this.i18n["noLastTitle"];
			// fin SWTRIA-987
			// create pageBar !
			pageBar.render ();
			pageBar.initialize();
			
			return pageBar;
		}
		else{
			pageBar.setVisibility (true);
		}
	}
	
	return null;
};

/**
 * Hide the pagination bar.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.deletePageBar = function(pageBarId){
	var pageBar = SweetDevRia.$ (pageBarId); // SWTRIA-1306
	if (pageBar != null) {
		pageBar.setVisibility (false);
	}
};

/**
 * Call the excel export
 * 
 * @private
 */
SweetDevRia.Grid.prototype.callExcelExport = function(){
	var radios = document.getElementsByName (this.id+"_excelExport_mode");
	var radio = radios[0]; 
	if (radios[1].checked) {
		radio = radios[1]; 
	}

	var exportMode = SweetDevRia.Grid.MODEL_EXPORT;
	if (radio.id == this.id+"_excelExport_wysiwyg") {
		exportMode = SweetDevRia.Grid.WYSIWYG_EXPORT;
	}

	var check = document.getElementById (this.id+"_excelExport_check");	
	var rowIds = null;
	if (check && check.checked) {
		rowIds = this.getCheckedRows ();
	}

	this.excelExport (exportMode, rowIds, this.currentExportProcessing);

	var win = SweetDevRia.$ (this.excelPropertiesWindowId);
	win.close ();
};

/**
 * Call the Multiple Column Sort method with parameters of the multiple column
 * sort Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.callGrouping = function(){
	var grouping = [];
	
	for (var i = 0; i < this.groupingPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_group_"+i);
		
		var colId = select.options[select.selectedIndex].value;
		if (colId != "" && ! grouping.contains(colId)) {
			grouping.add (colId);
		}
	}

	this.groupingBy (grouping);
	
	var win = SweetDevRia.$ (this.groupingPropertiesWindowId);
	win.close ();
};


/**
 * Call the Multiple Column Sort method with parameters of the multiple column
 * sort Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.callMultipleColumnSort = function(){
	var columnsOrder = [];
	
	for (var i = 0; i < this.sortPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_sort"+i);
		
		var colId = select.options[select.selectedIndex].value;
		if (colId != "") {
			var radios = document.getElementsByName (this.id+"_sort"+i+"_order");
			var radio = radios[0]; 
			if (radios[1].checked) {
				radio = radios[1]; 
			}

			var asc = null;
			if (radio.id == this.id+"_sort"+i+"_asc") {
				asc = true;
			}
			else {
				asc = false;
			}
	
			columnsOrder.add ([colId, asc, i]);
		}
	}


	this.multipleColumnSort (columnsOrder);

	var win = SweetDevRia.$ (this.sortPropertiesWindowId);
	win.close ();
};


/**
 * Create the excel Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createExcelProperties = function(){
	new SweetDevRia.Window(this.excelPropertiesWindowId,-1, -1,500,220,200,100,2000,2000,null ,true, false, true);

	var win = SweetDevRia.$ (this.excelPropertiesWindowId);
	win.title = this.getMessage("exportExcelProperties");
	win.message = null;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;
	win.canMaximize = false;
	win.canMinimize = false;

	win.content = this.getRenderString (this.templateExcelProperties);

	win.render ();
	SweetDevRia.init ();
	
	var winElem = win.getView ();
	document.body.appendChild (winElem);
};

/**
 * Show the Grid Properties Window
 */
SweetDevRia.Grid.prototype.showGridProperties = function(){
	if(this.beforeShowGridProperties()){
		var refreshVisibilities = false;
		
		if (SweetDevRia.$ (this.gridPropertiesWindowId) == null) {
			SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);
			this.createGridProperties ();
			SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
		}
		
		var list = SweetDevRia.$(this.id+"_window_list");
		while(list.listItems.length>0){
			list.deleteItem(0);
		}
		
		if (this.hasHeaderGroup) {
			var colOrder = SweetDevRia.DomHelper.get(this.id+"_columns_order");
			SweetDevRia.DomHelper.setStyle(colOrder, "display", "none");
		}
		
		var columnsOrder = [];
		
		for(var i=0;i<this.getColumnNumber();++i){
			var column = this.getColumnAtPosition(i);
			if(!this.isTreeGrid || column.position!=0){ // dans le cas d'un
														// treegrid, on ajoute
														// pas la premiere
														// colonne (celle qui
														// contient les noeuds
														// de l arbre
				if(column.visible ){ // on n ajoute pas les colonnes cachees
					list.insertData({"label":column.header, "id":column.id});
				}
			}
		}
		
		// on rafrachit la taille de la list pour s'adapter au nouveau nombre
		// d'item
		list.getFrame().refreshBorders();
		
		
		
		SweetDevRia.$ (this.gridPropertiesWindowId).open ();
		
		var frame =  list.getFrame();
		if (frame && frame.initialized) {
			frame.refreshBorders();
		}
		
		// On recupere le ul englobant des checkbox
		var ul = document.getElementById (this.id+"_visibility_checkboxes");
		
		// on le supprime les anciennes checkbox
		ul.innerHTML = "";
		
		// on parcours les colonnes dans l'ordre
		var col = this.getFirstColumn ();
		for (i = 1; i <= this.columnNumber; i++) {
			if(!this.isTreeGrid || col.position!=0){ // dans le cas d'un
														// treegrid, on ajoute
														// pas la premiere
														// colonne (celle qui
														// contient les noeuds
														// de l arbre
				var li = document.createElement ("li");
				li.setAttribute ("id", this.id+"_"+col.id + "_visibility_li");
	
				// on genere la chexkbox qui va bien
				var check = document.createElement ("input");
				check.setAttribute ("id", this.id+"_"+col.id + "_visibility");
				check.setAttribute ("type", "checkbox");
				if (! col.hideable) {
					check.disabled = "disabled";
				}
				li.appendChild (check);
	
				var label = document.createElement ("label");
				label.setAttribute ("for", this.id+"_"+col.id + "_visibility");
				var text = document.createTextNode (col.header);
				label.appendChild (text);
				li.appendChild (label);
	
				ul.appendChild (li);
	
	
				// on recupere le checkbox et le label que l on vient de creer
				check = document.getElementById (this.id+"_"+col.id + "_visibility");
				
				SweetDevRia.Grid.setPropertiesCheck (check, col.visible);
				
				// on palce le listener de check/uncheck qui jouera avec la
				// visibilite des items de la liste
				SweetDevRia.EventHelper.addListener(check, "click", this.onPropertiesCheck, [this, col.id]);
			}
			
			col = this.getNextColumn (col);
		}
		
		this.afterShowGridProperties();
	}
};


/**
 * set visibility of a checkbox into the property window
 * @param check {input} the checkbox to check
 * @param checked {Boolean} state of the checkbox
 */
SweetDevRia.Grid.setPropertiesCheck = function (check, checked) {
	label = SweetDevRia.Form.getLabelTag (check.id);
	
	// srevel : on le ne check qu apres sa creation car IE n 'aime
	// pas checker avant le appendChild, merci IE !!
	if (checked) check.checked = "checked";
	else check.checked = "";
				
	// srevel :: Dans le cas d un groupBy, on en peut pas
	// cocher/decocher une checkbox d'une colonne groupee
	if (this.groupBy && this.groupBy.contains (col.id)) {
		check.style.display = "none";
		label.style.display = "none";
	}
	else {
		check.style.display = "inline";
		label.style.display = "inline";
	}
};

/**
 * Action executer qd on clique sur l une des checkbox de visibilite de la
 * fenetre de properties de la grid.
 * 
 * Le check/uncheck provoque le add/delete de l'item associe dans la liste de
 * sort
 * 
 */
SweetDevRia.Grid.prototype.onPropertiesCheck = function (evt, params) {
	var grid = params[0];
	var colId = params[1];

	evt = SweetDevRia.EventHelper.getEvent (evt);
	var checked = evt.src.checked;

	var column = grid.getColumn (colId);
	
	var list = SweetDevRia.$ (grid.id+"_window_list"); // Recuperation de la
														// liste de tri des
														// colonnes dans la
														// fenetre de proprietes
	
	
	// recuperation de l'index de col dans cette liste

	var index = null;
	if (checked) {
		// Si on coche la case, c est que l'item n'est pas visible dans la list,
		// on doit
		// donc l'inserer e sa position en fonction des checkbox cochees
		var index = 0;

		var ul = document.getElementById (grid.id+"_visibility_checkboxes");

		for (i = 0; i < ul.childNodes.length; i++) {
			// recuperation de la checkbox associe a cette li
			var li = SweetDevRia.DomHelper.getChildByTagName (ul, i, "li");
			var checkbox = SweetDevRia.DomHelper.getFirstChild (li, "input");
		
			// si cette checkbox correspond a la colonne, on s'arrete
			if (checkbox.id == grid.id+"_"+column.id+"_visibility") {
				break;
			}
			
			if (checkbox && checkbox.checked) {
				index ++;	
			}
		}

		// on insere le nuvelle item dans la liste qui correspond a la checkob
		// cochee
		var data = {"label":column.header, "id":column.id}; // donnee e ajouter
															// e la liste

		list.insertData (data, index);
	}
	else {
		// Si on decoche la case, on doit supprimer l'item en fonction de son id
		list.deleteItemById (column.id);
	}

	// on rafrachit la taille de la list pour s'adapter au nouveau nombre d'item
	list.getFrame().refreshBorders();
};




/**
 * Create the grid properties window, and the list inside
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createGridProperties = function(){
	new SweetDevRia.Window(this.gridPropertiesWindowId,-1, -1,SweetDevRia.Grid.WINDOW_WIDTH,SweetDevRia.Grid.WINDOW_HEIGHT,200,100,2000,2000,null ,true, false, true);
	
	var win = SweetDevRia.$ (this.gridPropertiesWindowId);
	win.title = this.getMessage("gridProperties");
	win.message = null;
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;

	win.content = this.getRenderString (this.templateGridProperties);

	win.render ();

	SweetDevRia.init();

	var winElem = win.getView ();
	document.body.appendChild (winElem);

	var list = new SweetDevRia.List(this.id+"_window_list");

	list.i18n={};
	list.totalItemNumber = 15;// this.columnsNumber
	list.canDelete = true;
	list.isStateful = false;
	list.canModify = false;
	list.canAdd = true;
	list.canOrder = true;
	list.canResize = false;
	list.formatData = function(data){
		return data.label;
	};
	list.render();
	
	SweetDevRia.addListener (list, SweetDevRia.List.MOVE_EVENT, function (comps, evtParam) {
		// lorsque l'on bouge un item de la liste, on deplace la checkbox de la
		// mm maniere
		
		var list = comps [0];
		var grid = comps [1];
		
		var oldPos = evtParam [0];
		var newPos = evtParam [1];
		
		// je dois prendre la nieme checkbox en fonction de la oldPos (index de
		// l'item de list qui vient d etre droppe)
		// donc je prend le nieme tag li
		var ul = document.getElementById (grid.id+"_visibility_checkboxes");
		var li = SweetDevRia.DomHelper.getChildByTagName (ul, oldPos, "li");
		
		var checked = li.firstChild.checked;

		// on deplace le tag li contenant la checbox e sa nouvelle position
		// Si on deplace vers une place plus grande, il faut incrementer car le
		// noeud sera d'abord supprime
		if(newPos > oldPos) {
			newPos ++;
		}
		if (newPos < ul.childNodes.length) {
			var nextChild = SweetDevRia.DomHelper.getChildByTagName (ul, newPos, "li");
			ul.insertBefore (li, nextChild);
		}
		else {
			ul.appendChild (li);
		}
		SweetDevRia.Grid.setPropertiesCheck (li.firstChild, checked);
		
	}, [list, this]);
	
	
	list.generateWindow = function(){};
	list.generateMenu = function(){};
	
	list.createFrame();
	list.getFrame().contentId = this.id+"_window_list_list";
	list.getFrame().resizeMode = SweetDevRia.Frame.RESIZE_MODE_NONE;
	list.getFrame().borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;
	list.getFrame().canDrag = false;
	list.getFrame().showBorderOnOver = false;
	
	SweetDevRia.init();
};

/**
 * Action triggered on the grid properties through the window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.callApplyGridProperties = function(){
	// visibility
	for(var col in this.columns){
		var checkbox = SweetDevRia.DomHelper.get(this.id+"_"+col+"_visibility");
		if (checkbox) {
			var choice = checkbox.checked;
			if( !(this.columns[col].visible == choice) ){
				this.setColumnVisibility(col, choice);
			}
		}
	}
	
	// order
	var orders = SweetDevRia.$(this.id+'_window_list').listItems;
	
	// srevel : on doit parcourir les colonnes de la list
	// si l'ordre est le mm que les colonnes VISIBLES, on en touche a rien
	// sinon on lance un setcolumnposition
	var orders = SweetDevRia.$(this.id+'_window_list').listItems;
	for(var i=0;i<orders.length;++i){
		var pos = i;
		if (this.isTreeGrid) {
			pos ++; 
		}
		if(this.getVisibleColumnByPos (pos).id != orders[i].data.id){
			this.setColumnPosition (orders[i].data.id, pos);
		}
	}
	
	SweetDevRia.$ (this.gridPropertiesWindowId).close ();
};

/**
 * Show the Excel Window
 * 
 * @private
 */

SweetDevRia.Grid.prototype.showExcelProperties = function(exportId){
	// set the export being processed
	this.currentExportProcessing = exportId;

	if (SweetDevRia.$ (this.excelPropertiesWindowId) == null) {
		SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);
		this.createExcelProperties ();
		SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
	}

	// refresh selected values
	var radioWysiwyg = document.getElementById (this.id+"_excelExport_wysiwyg");
	var radioModel = document.getElementById (this.id+"_excelExport_model");
	var check = document.getElementById (this.id+"_excelExport_check");

	SweetDevRia.$ (this.excelPropertiesWindowId).open ();

	// We have to create the window with its fields before because IE6 does not
	// like to change there properties if its not created or visible.
	radioWysiwyg.checked = true;
	radioModel.checked = false;
	if (check) {
		if (this.checkedRows.length > 0) {
			check.checked = true;
			check.disabled = false;
		}
		else {
			check.checked = false;
			check.disabled = true;
		}
	}

};

/**
 * Create the multiple column sort Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createSortProperties = function(){
	new SweetDevRia.Window(this.sortPropertiesWindowId,-1, -1,SweetDevRia.Grid.WINDOW_WIDTH,SweetDevRia.Grid.WINDOW_HEIGHT,200,100,2000,2000,null ,true, false, true);
	
	var win = SweetDevRia.$ (this.sortPropertiesWindowId);
	win.title = this.getMessage("multipleSortProperties");
	win.message = null;
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;

	// transform an in to an array for the template
	var index = this.sortPropertiesDeep;
	this.sortPropertiesDeep = [];
	for (var i = 0; i < index; i ++) {
		this.sortPropertiesDeep.add (i);
	} 
	
	win.content = this.getRenderString (this.templateSortProperties);

	win.render ();

	SweetDevRia.init ();

	var winElem = win.getView ();
	document.body.appendChild (winElem);
};

/**
 * Create the grouping Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createGroupingProperties = function(){
	new SweetDevRia.Window(this.groupingPropertiesWindowId,-1, -1,SweetDevRia.Grid.WINDOW_WIDTH,SweetDevRia.Grid.WINDOW_HEIGHT,200,100,2000,2000,null ,true, false, true);
	
	var win = SweetDevRia.$ (this.groupingPropertiesWindowId);
	win.title = this.getMessage("groupingProperties");
	win.message = null;
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.showCorner = false;
	win.isResizable = false;

	// transform an in to an array for the template
	var index = this.groupingPropertiesDeep;
	this.groupingPropertiesDeep = [];
	for (var i = 0; i < index; i ++) {
		this.groupingPropertiesDeep.add (i);
	} 
	
	win.content = this.getRenderString (this.templateGroupingProperties);

	win.render ();
	SweetDevRia.init ();
	
	var winElem = win.getView ();
	document.body.appendChild (winElem);
};

/**
 * Show the multiple column sort Window
 * 
 * @private
 */
SweetDevRia.Grid.prototype.showSortProperties = function(){
	if (SweetDevRia.$ (this.sortPropertiesWindowId) == null) {
		SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);
		this.createSortProperties ();
		SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
	}

	// refresh selected values
	for (var i = 0; i < this.sortPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_sort"+i);

		select.options.length = 0;
		if(i != 0){
			var anOption = document.createElement("OPTION");
			select.options.add(anOption);
			anOption.text = " ";
			anOption.value = "";
		}
		var isSelected = false;
		radioAscValue = true;
	    for (var colId in this.columns) {
			var col = this.getColumn (colId);
			if (col && col.visible) {
				var anOption = document.createElement("OPTION");
				select.options.add(anOption);
				anOption.text = this.getHeaderText (col.id);
				anOption.value = colId;
				if (col.ascendant != null && (col.sortOrder == null || col.sortOrder == i)) {
					anOption.selected = true;
					isSelected = true;
					radioAscValue = col.ascendant != null ? col.ascendant : true; 
				}
			}
		}

		if (! isSelected) {
			var options = select.options; 
			if (i == 0)  {
				for (var j = 0; j < options.length; j++) {
					var id = options[j].value;
					if (id != "") {
						var col = this.getColumn (id);
						if (col == this.getFirstVisibleColumn()) {
							options [j].selected = true;
							break;
						}
					}
				}
			}
			else {
				options [0].selected = true;
			}
		}
		
		var radioAsc = document.getElementById (this.id+"_sort"+i+"_asc");
		var radioDsc = document.getElementById (this.id+"_sort"+i+"_dsc");
		radioAsc.checked = radioAscValue;
		radioDsc.checked = ! radioAscValue;
	} 

	SweetDevRia.$ (this.sortPropertiesWindowId).open ();
};


/**
 * Show the grouping Window
 * 
 * @private
 */

SweetDevRia.Grid.prototype.showGroupingProperties = function(){
	if (SweetDevRia.$ (this.groupingPropertiesWindowId) == null) {
		SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);
		this.createGroupingProperties ();
		SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
	}

	// refresh selected values
	for (var i = 0; i < this.groupingPropertiesDeep.length; i ++) {
		var select = document.getElementById (this.id+"_group_"+i);

		select.options.length = 0;
		var anOption = document.createElement("OPTION");
		select.options.add(anOption);
		anOption.text = " ";
		anOption.value = "";

		var isSelected = false;

		// on ajoute toutes les colonnes visibles aux select
		var col = this.getFirstColumn ();
		for (j = 0; j < this.columnNumber; j++) {
			
			if (col.visible || col.grouped) {
			
				var anOption = document.createElement("OPTION");
				select.options.add(anOption);
				anOption.text = this.getHeaderText (col.id);
				anOption.value = col.id;
	
				if (this.groupBy && this.groupBy.indexOf (col.id) == i) {
					anOption.selected = true;
					isSelected = true;
				}
			}
			
			col = this.getNextColumn (col);
		}

		if (! isSelected) {
			var options = select.options; 
			options [0].selected = true;
		}
		
	} 

	SweetDevRia.$ (this.groupingPropertiesWindowId).open ();
	SweetDevRia.$ (this.groupingPropertiesWindowId).resizePanel();
};

/**
 * Generate an axport to excel format. SWTRIA-1312
 */
SweetDevRia.Grid.prototype.callExportExcel = function(){
	if(this.innerExportMode){
		this.excelExport(this.innerExportMode,this.innerOnlyChecked?this.getCheckedRows():null,this.innerExportId);
	}
	else{
		this.showExcelProperties(this.innerExportId);
	}
}

/**
 * Create the context menu. This menu is plugged on right click.
 * 
 * @private
 */
SweetDevRia.Grid.prototype.createContextMenu = function(e){
	var menu = new SweetDevRia.ContextMenu (this.id + "Menu");
	menu.targetId = this.id+"_bodyDiv"; 
	
	var table = this;
	
	if (! this.isTreeGrid) {
		var menuItemSort = new SweetDevRia.MenuItem(this.id + "MenuItemSort");
		menuItemSort.label = this.getMessage('sortMenu');
		menuItemSort.checkbox = false;
		menuItemSort.checked = false;
		menuItemSort.disabled = false;
		menuItemSort.image = null ;
		menuItemSort.onclick = function(){table.showSortProperties();};
		menuItemSort.oncheck = function(){};
		menuItemSort.onuncheck = function(){};
	
		menu.addItem(menuItemSort);
	
		var menuItemGroup = new SweetDevRia.MenuItem(this.id + "MenuItemGroup");
		menuItemGroup.label = this.getMessage('groupingMenu');
		menuItemGroup.checkbox = false;
		menuItemGroup.checked = false;
		menuItemGroup.disabled = false;
		menuItemGroup.image = null ;
		menuItemGroup.onclick = function(){table.showGroupingProperties();};
		menuItemGroup.oncheck = function(){};
		menuItemGroup.onuncheck = function(){};
	
		menu.addItem(menuItemGroup);
	}
	
	if(this.innerExportId){
		var menuItemExport = new SweetDevRia.MenuItem(this.id + "MenuItemExport");
		menuItemExport.label = this.getMessage('excelMenu');
		menuItemExport.checkbox = false;
		menuItemExport.checked = false;
		menuItemExport.disabled = false;
		menuItemExport.image = null ;
		menuItemExport.onclick = function(){table.callExportExcel()}; // SWTRIA-1312
		menuItemExport.oncheck = function(){};
		menuItemExport.onuncheck = function(){};
		menu.addItem(menuItemExport);
	}


	var menuItemVisibility = new SweetDevRia.MenuItem(this.id + "MenuItemVisibility");		
	menuItemVisibility.label = this.getMessage('visibilityMenu');
	menuItemVisibility.checkbox = false;
	menuItemVisibility.checked = false;
	menuItemVisibility.disabled = false;
	menuItemVisibility.image = null ;
	menuItemVisibility.onclick = function(){};
	menuItemVisibility.oncheck = function(){};
	menuItemVisibility.onuncheck = function(){};

	menu.addItem(menuItemVisibility);

	var table = this;
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column != null) {		
			var menuItem = new SweetDevRia.MenuItem(this.id + "MenuItem"+colId);
			menuItem.label = this.getHeaderText (column.id);

			menuItem.checkbox = column ["hideable"];
			menuItem.checked = column ["visible"];
			menuItem.disabled = (!column ["hideable"]) || ((this.groupBy!=null) && this.groupBy.contains (colId));
			menuItem.image = null ;
			
			menuItem.onclick = function(){};
			menuItem.oncheck = menuItemCheck (table, colId);
			menuItem.onuncheck = menuItemUncheck (table, colId);

			menuItemVisibility.addItem(menuItem);
		}	
	}
	
	// Add the custom menu item
	for(var i=0;i<this.listMenuItems.length;i++){
		menu.addItem(this.listMenuItems[i]);
	}

	// We plug the context menu on all headers right click
    for (var colId in this.columns) {
		var column = this.getColumn (colId);
		if (column) {		
			document.getElementById(this.headPrefix + colId).oncontextmenu = function(e){return menu.show(e); };
		}
	}
	
	// We plug the context menu on all group headers right click
	for(var groupId in this.groups){
		var group = this.getGroup (groupId);
		if(group){
			document.getElementById(this.headPrefix + groupId).oncontextmenu = function(e){return menu.show(e); };
		}
	}

	// create menu !
	menu.render ();

	if (SweetDevRia.isInit) {
		SweetDevRia.initCompNotInitialized ();
	}
	
	return menu.show(e);
};

function menuItemCheck (table, colId){
	return function(){
		// srevel : On doit verifier si la methode menuItemUncheck e passer
		// provisoirement une colonne
		// en mode non cachable et la remettre dans son mode d'origine si c'est
		// le cas
		if (table.getVisibleColumnNumber () == 1) {
			var col = table.getFirstVisibleColumn ();
			if (col.temporaryNotHideable) {
				col.temporaryNotHideable = false;
				var menuItem = SweetDevRia.$(table.id + "MenuItem"+col.id);
				menuItem.setDisabled (false);
				col.hideable = true;
			}
		}

		table.setColumnVisibility (colId, true);
	};
}

function menuItemUncheck (table, colId){
	return function(){
		table.setColumnVisibility (colId, false);
		
		// srevel : on doit faire un test pour voir s'il ne reste plus qu'une
		// colonne visible
		// si tel est le cas, il faut la passer provisoirement en mode non
		// cachable si ce n'est pas deja le cas
		if (table.getVisibleColumnNumber () == 1) {
			var col = table.getFirstVisibleColumn ();
			if (col.hideable) {
				col.temporaryNotHideable = true;
				var menuItem = SweetDevRia.$ (table.id + "MenuItem"+col.id);
				menuItem.setDisabled (true);
				col.hideable = false;
			}
		}
	};
}

/**
 * Add an item to the context menu
 * 
 * @param {SweetDevRia.MenuItem}
 *            Menu Item to add
 */
SweetDevRia.Grid.prototype.addMenuItem = function(menuItem){
	this.listMenuItems[this.listMenuItems.length] = menuItem;
};


/**
 * Set all column elements visiblity
 * 
 * @param {String}
 *            colId Identifiant of the column to show or hide
 * @param {boolean}
 *            visibility The new visibility of the column
 * @private
 */
SweetDevRia.Grid.prototype.setColumnElementsVisibility = function(colId, visibility){
	var spliterVisibility = visibility;
	
	var column = this.getColumn (colId);
	var size = this.getColumnSize(column);
	
	var position = column.position;

	var spliterPosition = column.position;
	var cellIndex = this.getCellIndexFromPosition (position);
	
	var lastColumn = this.getLastColumn ();
	var lastCellIndex = this.getCellIndexOfColumn (lastColumn);
	var lastVisibleColumn = this.getLastVisibleColumn ();
	var lastVisibleCellIndex = this.getCellIndexOfColumn (lastVisibleColumn);
	var prevColId = null;
	
	// If we hide the last column, we change the spliter position to hide (we
	// take the previous, not next)
	if ( cellIndex >= lastVisibleCellIndex ) {
		spliterPosition = this.getPreviousVisibleSpliterPosition(spliterPosition);
		
		var previousCol = this.getPreviousVisibleColumn(column);
		if (previousCol) {
			prevColId = previousCol.id;
		}
	}
	var length = this.getVisibleRowNumber ();

	for(var i=0;i<length;i++){
		var rowId = this.getRowIdByIndex(i);
		
		var row = document.getElementById (this.id+"_table_"+rowId);
		row.style.width = "1px";
		
		var col = SweetDevRia.DomHelper.get (this.id+"_cell_"+rowId+"_"+colId); 
		this.setElemVisibility (col, visibility, size);

		var spliter = SweetDevRia.DomHelper.get (this.id+"_cell_spliter_"+rowId+"_"+(prevColId?prevColId:colId)); 
		this.setElemVisibility (spliter, spliterVisibility, SweetDevRia.Grid.SPLITER_SIZE);
	}

	// SWTRIA-1206
	// Il faut aussi rendre visible/invisible le headColumnBefore
	var headerBefore = SweetDevRia.DomHelper.get (this.id+"_head_before_"+position); 
	this.setElementVisibility (headerBefore, visibility, 1);

	var header = SweetDevRia.DomHelper.get (this.id+"_head_col_"+position); 
	// SWTRIA-1115
	// on précise la taille pour ne pas se retruover en auto
	this.setElementVisibility (header, visibility, size - 1);

	var headerSpliter = SweetDevRia.DomHelper.get (this.id+"_head_spliter_"+spliterPosition); 
	this.setElementVisibility (headerSpliter, spliterVisibility, SweetDevRia.Grid.SPLITER_SIZE);

	this.resetSpliters ();

	// SWTRIA-1115, SWTRIA-1206
	var diff = 0;
	if(!visibility){
		// si la colonne a disparue
		// on resize la taille de l'actuelle deriere colonne
		var rowWidth = SweetDevRia.DomHelper.getWidth(this.rowsTable[0]);
		var gridWidth = this.getSize(this.width);
		if(rowWidth < gridWidth){
			diff = gridWidth - rowWidth;
			this.updateLastColumnSize (diff);
		}		
	}
	else{
		// si la colonne est apparue
		// on retreci la taille de l'ancienne derniere colonne
		// en la remettant à column.size
		var colToResize = lastVisibleColumn;
		if(prevColId){
			// la derniere colonne va apparaitre
			// il faut donc resizer l'avant derniere colonne a sa taille
			// theorique
			colToResize = this.getColumn(prevColId);
			this.updateColumnSize(colToResize);
			
			// et resize la nouvelle derniere colonne
			var rowWidth = SweetDevRia.DomHelper.getWidth(this.rowsTable[0]);
			var gridWidth = this.getSize(this.width);
			if(rowWidth < gridWidth){
				diff = gridWidth - rowWidth;
				this.updateLastColumnSize (diff);
			}
		}
		else{
			// sinon, la derniere colonne doit etre reduite
			// de la taille de la colonne qui vient d'apparaitre
			// SWTRIA-1058
			// comme il ne s'agit pas de la derniere colonne, elle a sa taille
			// theorique
			diff = column.size + SweetDevRia.Grid.SPLITER_SIZE;
			this.updateLastColumnSize (-diff);
		}
	}
};



SweetDevRia.Grid.prototype.getSpliterPosition = function(column, visibility){
	var spliterPosition = column.position ;
	var parentGroupId = column.parentGroupId;
	if (parentGroupId) {
		var parentGroup = this.getGroup (parentGroupId);
		if (parentGroup && !visibility) {
			var nbVisible = 1;	
			for(var i = 0; i<parentGroup.childrenIds.length; i++){
				if(this.getColumnVisibility(parentGroup.childrenIds[i])){
					nbVisible++;
				}
			}
			if(nbVisible == 1){
				spliterPosition = this.getNextVisibleSpliter(column);
			}
			else{
				if(this.getNextVisibleColumn(column)){
					if(parentGroupId != this.getNextVisibleColumn(column).parentGroupId){
						spliterPosition = this.getPreviousVisibleSpliter(column);
					}
					else{
						spliterPosition = this.getNextVisibleSpliter(column);
					}
				}
				else{
					return null;
				}		
			}
		}
		else if(parentGroup && visibility){
			var nbVisible = 0;	
			for(var i = 0; i<parentGroup.childrenIds.length; i++){
				if(this.getColumnVisibility(parentGroup.childrenIds[i])){
					nbVisible++;
				}
			}
			if(nbVisible == 1){
				// retourne le dernier splitter du groupe
				spliterPosition = this.getColumn(parentGroup.childrenIds[parentGroup.childrenIds.length-1]).position;
			}
			else{
				if(this.getNextVisibleColumn(column)){
					if(parentGroupId != this.getNextVisibleColumn(column).parentGroupId){
						spliterPosition = column.position - 1;
					}
					else{
						spliterPosition = column.position; 
					}
				}
				else{
					return null;
				}		
			}
		}
	}
	return spliterPosition;
};



SweetDevRia.Grid.prototype.getNextVisibleSpliter = function(col){
	for(var i=col.position;i<this.columnNumber;i++){
		var spliter = SweetDevRia.DomHelper.get(this.id+'_head_spliter_'+i);
		if(spliter){
			var size = spliter.style.width;
			if(size == (SweetDevRia.Grid.SPLITER_SIZE+"px")){
				return i;		
			}
		}
		else{
			return null;
		}
	}
	return null;
};


SweetDevRia.Grid.prototype.getPreviousVisibleSpliter = function(col){
	for(var i=col.position-1;i>-1;i--){
		var spliter = SweetDevRia.DomHelper.get(this.id+'_head_spliter_'+i);
		if(spliter){
			var size = spliter.style.width;
			if(size == (SweetDevRia.Grid.SPLITER_SIZE+"px")){
				return i;		
			}
		}
		else{
			return null;
		}
	}
	return null;
};


SweetDevRia.Grid.prototype.setElemVisibility = function(elem, visibility, size){
	if (elem) {
		elem.style.width = size?(size+"px"):"auto";
		if (visibility) {
			elem.style.display = "";
		}
		else {
			elem.style.display = "none";
		}
		
		return null;
	}
	else {
		var style = '';
		style +=  "width:"+(size?(size+'px;'):'auto;');

		if (! visibility) {
			style += ' display:none;';
		}

		return style;
	}
};


/**
 * Set an element visiblity
 * 
 * @param {HtmlElement}
 *            elem Html elmenent to show or hide
 * @param {boolean}
 *            visibility The new visibility of the element
 * @param {int}
 *            size the size of the column to use instead of auto
 * @private
 */
SweetDevRia.Grid.prototype.setElementVisibility = function(elem, visibility, size){
	var style = '';
	if (elem) {
		if (typeof ActiveXObject != "undefined") { // if IE
			if (visibility) {
				elem.style.width = size?(size+"px"):"auto";
				elem.style.display = "block";
			}
			else {
				elem.style.width = "0px";
				elem.style.display = "none";
			}
		}
		else {
			if (visibility) {
				elem.style.width = size?(size+"px"):"auto";
				elem.style.visibility = "visible";
			}
			else {
				elem.style.width = "0px";
				elem.style.visibility = "collapse";
			}
		}
		return null;
	}else{
		if (typeof ActiveXObject != "undefined") { // if IE
			if (visibility) {
				style='width:'+(size?(size+'px'):'auto')+';display:block;';
			}
			else {
				style='width:0px;display:none;';
			}
		}
		else {
			if (visibility) {
				style='width:'+(size?(size+'px'):'auto')+';visibility:visible;';
			}
			else {
				style='width:0px;visibility:collapse;';
			}
		}
		return style;
	}
};

/**
 * Test an element visiblity
 * 
 * @param {HtmlElement}
 *            elem Html elmenent to test
 * @return true if elem is visible, false if not, null if elem doesn t exist
 * @type boolean
 * @private
 */
SweetDevRia.Grid.prototype.testElementVisibility = function(elem){
	if (elem) {
		if (typeof ActiveXObject != "undefined") { // if IE
			return (elem.style.display != "none");
		}
		else {
			return (elem.style.visibility == "visible" || elem.style.visibility == "");
		}
	}
	
	return null;
};

/**
 * Swap an element visiblity. Show it if it's hide, or hide if it's visible.
 * 
 * @param {HtmlElement}
 *            elem Html elmenent to swap
 * @private
 */
function swapVisibility (elem) {
	if (! elem){
		return;
	}
	if (elem.style.display == "none"){
		elem.style.display = "";
	}
	else{ 
		elem.style.display = "none";
	}
}

/**
 * Return the next visible row, not detail or grouping header
 * 
 * @param {Array}
 *            rows the rows array
 * @param {int}
 *            rowIndex the actual index
 * @return next visible row, not detail or grouping header
 * @type tr
 * @private SWTRIA-1313
 */
SweetDevRia.Grid.prototype.getNextVisibleRow =  function (rows, rowIndex) {
	var nextIndex = rowIndex + 1;
	var next = 	rows [nextIndex];
	
	while (! YAHOO.util.Dom.hasClass(next,"ideo-ndg-row")|| next.style.display == "none") {	
		if (nextIndex == rows.length - 1) {
			next = rows [nextIndex];
			break;
		}
		nextIndex++;
		next = 	rows [nextIndex];
	}

	return next;
};

/**
 * Return the previous visible row, not detail or grouping header
 * 
 * @param {Array}
 *            rows the rows array
 * @param {int}
 *            rowIndex the actual index
 * @return previous visible row, not detail or grouping header
 * @type tr
 * @private SWTRIA-1313
 */
SweetDevRia.Grid.prototype.getPreviousVisibleRow =  function (rows, rowIndex) {
	var prevIndex = rowIndex - 1;
	var previous = 	rows [prevIndex];
	
	while (! YAHOO.util.Dom.hasClass(previous,"ideo-ndg-row") || previous.style.display == "none") {
		if (prevIndex == 0) {
			previous = rows [prevIndex];
			break;
		}
		prevIndex--;
		previous = 	rows [prevIndex];
	}

	return previous;
};

/**
 * Find the next selection with a keycode (left, up, rigth, bottom arrow) from a
 * selection.
 * 
 * @param {String}
 *            lastSelection Start selection (rowId)
 * @param {Event}
 *            evt Key event
 * @return the next row id selection
 * @type String
 * @private
 */
SweetDevRia.Grid.prototype.getNextRowSelection =  function (lastSelection, evt) {
	var nextSelectionNode = null;
	var keyCode = evt.keyCode;
	var ctrl = evt.ctrl;

	var rowNode = document.getElementById (this.id+"_tr_"+lastSelection);
	// var rows = rowNode.parentNode;
	var rows = this.rowsTable;

	if (keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) {
		if (ctrl) {
			// va a la derniere ligne
			nextSelectionNode = this.getLastVisibleRow();
		}
		else {
			var rowIndexT = this.getRowIndex(rows,rowNode);

			if (rowIndexT < rows.length - 1) { // srevel
				nextSelectionNode = this.getNextVisibleRow(rows, rowIndexT);// rows.rows
																			// [rowNode.rowIndex
																			// +
																			// 2];
			}
			else {
				nextSelectionNode = rowNode;
			}
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) {
		if (ctrl) {
			// va a la premiere ligne
			nextSelectionNode = this.getFirstVisibleRow();
		}
		else {
			var rowIndexT = this.getRowIndex(rows,rowNode);		
			if (rowIndexT > 0) { 
				nextSelectionNode = this.getPreviousVisibleRow(rows, rowIndexT); // rows.rows
																					// [rowNode.rowIndex
																					// -
																					// 2];
			}
			else {
				nextSelectionNode = rowNode;
			}
		}
	}

	if (nextSelectionNode != null) {
		var nextSelection =  nextSelectionNode.id.substring ((this.id+"_tr_").length);

		return nextSelection;
	}
	
	return null;
};

/**
 * @private
 */
SweetDevRia.Grid.prototype.getNextEditableCell =  function (lastSelection, evt, swapRow) {
	var next =  this.getNextCellSelection (lastSelection, evt, swapRow);

	var ref = lastSelection;
	while ((next[0] != ref[0] || next[1] != ref[1]) && ! this.getColumn (next[1]).editable) {
		ref = next;
		next = this.getNextCellSelection (next, evt, swapRow);
	}
	
	return next;
};

/**
 * Find the next selection with a keycode (left, up, rigth, bottom arrow) from a
 * selection.
 * 
 * @param {Array}
 *            lastSelection Start selection ( [rowId, columnId] )
 * @param {Event}
 *            evt Key event
 * @param {boolean}
 *            swapRow If true, when you search the next cell of the last cell of
 *            a row, this method return the first cell of the next row. Default
 *            is true
 * @return the next cell ids selection, [rowId, columnId]
 * @type Array
 * @private
 */
SweetDevRia.Grid.prototype.getNextCellSelection =  function (lastSelection, evt, swapRow) {
	if (swapRow == null){
		swapRow = true;
	}
	var keyCode = evt.keyCode;
	var ctrl = evt.ctrl;
	
	var column = this.getColumn (lastSelection[1]);
	var nextColumn = null; 
	
	var rowNode = document.getElementById (this.id+"_tr_"+lastSelection[0]);
	
	var rows = this.rowsTable;
	
	if (keyCode == SweetDevRia.KeyListener.ARROW_LEFT_KEY) {
		if (ctrl) {
			nextColumn = this.getFirstVisibleColumn ();
		}
		else {		
			nextColumn = this.getPreviousVisibleColumn (column);
			if (nextColumn == null && swapRow) {
				var rowIndexT = this.getRowIndex(rows,rowNode);
				var firstVisibleT = this.getRowIndex(rows,this.getFirstVisibleRow());				
				if (rowIndexT > firstVisibleT) { 
					rowNode = this.getPreviousVisibleRow(rows, rowIndexT); // rows.rows
																			// [rowNode.rowIndex
																			// -
																			// 2];
					nextColumn = this.getLastVisibleColumn ();
				}
				else {
					nextColumn = column; 
				}
			} 
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_RIGHT_KEY) {
		if (ctrl) {
			nextColumn = this.getLastVisibleColumn ();
		}
		else {		
			nextColumn = this.getNextVisibleColumn (column);
			if (nextColumn == null && swapRow) {
				var rowIndexT = this.getRowIndex(rows,rowNode);
				var lastVisibleT = this.getRowIndex(rows,this.getLastVisibleRow());
				if (rowIndexT < lastVisibleT) { 
					rowNode = this.getNextVisibleRow(rows, rowIndexT);
					nextColumn = this.getFirstVisibleColumn ();
				}
				else {
					nextColumn = column; 
				}
			} 
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_DOWN_KEY) {
		if (ctrl) {
			nextColumn = column;
			rowNode = this.getLastVisibleRow();// rows.rows [rows.rows.length -
												// 2];
		}
		else {		
			nextColumn = column;
			var rowIndexT = this.getRowIndex(rows,rowNode);
			var lastVisibleT = this.getRowIndex(rows,this.getLastVisibleRow());
			if (rowIndexT < lastVisibleT) { 
				rowNode = this.getNextVisibleRow(rows, rowIndexT); 
			}
		}
	}
	else if (keyCode == SweetDevRia.KeyListener.ARROW_UP_KEY) {
		if (ctrl) {
			nextColumn = column;
			rowNode = this.getFirstVisibleRow(); // rows.rows [0];
		}
		else {		
			nextColumn = column; 
			var rowIndexT = this.getRowIndex(rows,rowNode);
			var firstVisibleT = this.getRowIndex(rows,this.getFirstVisibleRow());
			if (rowIndexT > firstVisibleT) { 
				// rowNode = this.getPreviousVisibleRow(rows.rows,
				// rowNode.rowIndex); // rows.rows [rowNode.rowIndex - 2];
				rowNode = this.getPreviousVisibleRow(rows, rowIndexT); // rows.rows
																		// [rowNode.rowIndex
																		// - 2];
			}
		}
	}

	if (nextColumn && rowNode) {
		var nextRowId =  rowNode.id.substring ((this.id+"_tr_").length);
		return [nextRowId, nextColumn.id];
	}

	return null;
};


/**
 * Synchronize table scrollers to follow the selection
 * 
 * @param {rowId |
 *            [rowId, colunId]} selection Selected row or cell ids
 * @private
 */
SweetDevRia.Grid.prototype.synchronizeScrollers =  function (selection) {
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");

	var top = selection.offsetTop;
	var tdHeight = selection.offsetHeight;
	var height = SweetDevRia.DomHelper.parsePx (divBody.style.height);
	var scrollerHeight = SweetDevRia.DomHelper.getScrollerHeight (divBody);

	if (divBody.scrollTop + height - scrollerHeight < top + tdHeight) {
		divBody.scrollTop = top + tdHeight - height + scrollerHeight;
	}
	if (divBody.scrollTop > top) {
		divBody.scrollTop = top;
	}			

	var left = selection.offsetLeft;
	var tdWidth = selection.offsetWidth;
	var width = SweetDevRia.DomHelper.parsePx (divBody.style.width);
	
	if (divBody.scrollLeft + width < left + tdWidth) {
		divBody.scrollLeft = left + tdWidth - width;
	}
	if (divBody.scrollLeft > left) {
		divBody.scrollLeft = left;
	}	
};

/**
 * Check all checkboxes asscoiated with all selected rows. Be careful, this
 * method do nothing in cell selection mode.
 */
SweetDevRia.Grid.prototype.checkSelection =  function () {
	var selection = this.getSelection ();

	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION) {
		var rowId =  selection;
		this.setCheckbox (rowId, ! this.getCheckbox (rowId));
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION) {
		for (var i = 0; i < selection.length; i ++) {
			var rowId =  selection [i];
			this.setCheckbox (rowId, ! this.getCheckbox (rowId));
		}
	}
};



/**
 * Select all rows or cells if multiple selection is ok.
 */
SweetDevRia.Grid.prototype.selectAll =  function () {
	var cells = this.getFirstRow().cells;

	if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
		var firstCell = this.getFirstRow().cells[0];
		var lastCell = this.tableBody.rows[this.tableBody.rows.length - 2].cells [this.tableBody.rows[this.tableBody.rows.length - 2].cells.length - 1];


		var firstRow = firstCell.parentNode;
		var firstRowId =  firstRow.id.substring ((this.id+"_tr_").length);
		var firstColumnId =  this.getFirstVisibleColumn().id;

		var lastRow = lastCell.parentNode;
		var lastRowId =  lastRow.id.substring ((this.id+"_tr_").length);
		var lastColumnId =  this.getLastVisibleColumn().id;

		this.selectCellBloc ([firstRowId, firstColumnId], [lastRowId, lastColumnId], true);
	}
	else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
		var firstRow = this.getFirstRow ();
		var lastRow = this.tableBody.rows[this.tableBody.rows.length - 2];

		var firstRowId =  firstRow.id.substring ((this.id+"_tr_").length);
		var lastRowId =  lastRow.id.substring ((this.id+"_tr_").length);

		this.selectRowBloc (firstRowId, lastRowId, true);
	}
};


/**
 * Manage the key selection (simple or multiple)
 * 
 * @param {Event}
 *            evt Key event
 * @private
 */
SweetDevRia.Grid.prototype.keySelection =  function (evt) {
	var keyCode = evt.keyCode;
	var shift = evt.shift;
	var nextSelection = null;

	if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || ! shift){
		// Simple selection mode

		if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION) {
			this.clearSelection ();
		}

		if(this.selectionMode == SweetDevRia.Grid.ROW_SELECTION || this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			nextSelection = this.getNextRowSelection (this.lastSelectionAdded, evt);
			if (nextSelection != null){
				this.setRowSelection (nextSelection, true);
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.CELL_SELECTION || this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			nextSelection = this.getNextCellSelection (this.lastSelectionAdded, evt);

			if (nextSelection != null){
				this.setCellSelection (nextSelection[0], nextSelection[1], true);
			}
		}
		
		this.firstShiftSelection = null;
	}
	else {
		// multiple selection mode

		if (this.firstShiftSelection == null){ 
			this.firstShiftSelection = this.lastSelectionAdded;
		}
		
		if(this.selectionMode == SweetDevRia.Grid.CELLS_SELECTION){
			nextSelection = this.getNextCellSelection (this.lastSelectionAdded, evt, false);

			if (nextSelection != null) {
				// we unselect old bloc
				this.selectCellBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
	
				// we select the new bloc
				this.selectCellBloc (nextSelection, this.firstShiftSelection, true);

				this.lastSelectionAdded = nextSelection;
			}
		}
		else if(this.selectionMode == SweetDevRia.Grid.ROWS_SELECTION){
			nextSelection = this.getNextRowSelection (this.lastSelectionAdded, evt);
			if (nextSelection != null) {
				// we unselect old bloc
				this.selectRowBloc (this.lastSelectionAdded, this.firstShiftSelection, false);
				
				// we select the new bloc
				this.selectRowBloc (nextSelection, this.firstShiftSelection, true);
				
				this.lastSelectionAdded = nextSelection;
			}
		}
	}
	
	
	if (nextSelection != null) {
		this.synchronizeScrollers (nextSelection);		
	}

};

/**
 * Allow you to select a rows bloc in one shot ! that's select all rows between
 * row1 and row2.
 * 
 * @param {String}
 *            rowId1 First identifiant row of the bloc
 * @param {String}
 *            rowId2 Last identifiant row of the bloc
 * @param {boolean}
 *            select True if you want select the bloc, false else
 */
SweetDevRia.Grid.prototype.selectRowBloc =  function (rowId1, rowId2, select) {
	rowId2 = rowId2 || rowId1;
	
	var started = false;
	var finished = false;
	/**
	 * On a un tableau listRows qui contient les id de lignes ordonneees ou null
	 * si la ligne est un groupHeader
	 */
	for(var i=0;i<this.listRows.length && !finished;i++){
		if(!this.listRows[i]){
			continue;
		}
		
		if(this.listRows[i]==rowId1 || this.listRows[i]==rowId2){
			if(started || rowId1==rowId2){
				finished = true;
			}
			started = true;
		}		
		
		if(started){
			this.setRowSelection(this.listRows[i], select);
		}
	}
};

/**
 * Allow you to select a cells bloc in one shot ! that's select all cell between
 * cell1 and cell2.
 * 
 * @param {[rowId,
 *            columnId]} cellIds1 First bloc cell identifiants
 * @param {[rowId,
 *            columnId]} cellIds2 Last bloc cell identifiants
 * @param {boolean}
 *            select True if you want select the bloc, false else
 */
SweetDevRia.Grid.prototype.selectCellBloc =  function (cellIds1, cellIds2, select) {
	var rowId1 = cellIds1[0];
	var rowId2 = cellIds2[0];
	
	var column1 = this.getColumn(cellIds1[1]);
	var column2 = this.getColumn(cellIds2[1]);
	
	var startCol = column1.position-column2.position<0?column1:column2;
	var endCol  =  column1.position-column2.position<0?column2:column1;
	
	var cols = [];
	
	if(startCol!=endCol){
		cols.push(startCol.id);
		for(var i=startCol.position+1;i<endCol.position;i++){
			cols.push(this.getColumnIdAtPosition(i));
		}
		cols.push(endCol.id);
	}else{
		cols.push(startCol.id);
	}
	
	var started = false;
	var finished = false;
	for(var i=0;i<this.listRows.length && !finished;i++){
		if(!this.listRows[i]){
			continue;
		}
		
		if(this.listRows[i]==rowId1 || this.listRows[i]==rowId2){
			if(started || rowId1==rowId2){
				finished = true;
			}
			started = true;
		}		
		
		if(started){
			for(var j=0;j<cols.length;j++){
				this.setCellSelection(this.listRows[i],cols[j],select);
			}
		}
	}
};


/**
 * Retourne un group ou une colonne a partir de son identifiant
 */
SweetDevRia.Grid.prototype.getGroup =  function (groupId) {
  if (this.groups != null) {
      if (this.groups [groupId] != null) {
          return this.groups [groupId];
      }
  }
  
  return this.getColumn(groupId);
};

/**
 * On incremente de maniere recursive la propriete& depth des fils de ce group
 * ou colonne
 */
SweetDevRia.Grid.prototype.incrDepth =  function (groupId, depth) {

	var group = this.getGroup (groupId);
	if (group) {
   		group.depth = depth;
    
    	if (this.maxGroupDepth < group.depth) {
    		this.maxGroupDepth = group.depth;
    	}
    
    	if (group.childrenIds) { // si c ets pas une colonne
	      	// pour tous les fils on incremente leur profondeur de facon
			// recursive
	    	for (var i = 0 ; i < group.childrenIds.length; i++) {
	    		var childId =  group.childrenIds [i];
	    		this.incrDepth (childId,depth+1);
	        }
    	}
	}
};
 
/**
 * Cree un nouveau group et y ajoute des ss group ou des ss colonnes
 */
SweetDevRia.Grid.prototype.addGroup =  function (groupId , groupLabel, childrenIds) {

	this.hasHeaderGroup = true;

	// la depth sera mise a 0 par incrDepth
	this.groups [groupId] = {"id":groupId, "label" : groupLabel, "childrenIds" : childrenIds, "depth" : -1}; 

	var group = this.getGroup (groupId);
	group.colspan = 0;
	if (group.childrenIds) { // si c ets pas une colonne
      	// pour tous les fils on incremente leur profondeur de facon recursive
    	for (var i = 0 ; i < group.childrenIds.length; i++) {
    		var childId =  group.childrenIds [i];
    		var child = this.getGroup (childId);
    		if(child.colspan){
    			group.colspan += child.colspan;
    		}
    		else{
    			group.colspan++;
    		}
    		child.parentGroupId = groupId;
        }
	}
	this.incrDepth (groupId,0);
};




/**
 * Change le mode wrap / nowrap (passage a la ligne) du contenu des cellules
 * d'une ligne SWTRIA-1315
 * 
 * @private
 */
SweetDevRia.Grid.prototype.switchRowWrapMode = function (rowId) {
	// Pour toutes les colonnes visibles
	var col = this.getFirstVisibleColumn ();
	for (i = 0; i < this.visibleColumnNumber; i++) {
		if (col) {
			// On recupere la cellule
			var cell = document.getElementById (this.id+ "_cell_"+rowId+"_"+col.id);

			// TODO Il faudrait je pense ajouter un Id sur ce tag br pour le
			// recuperer directement et eviter les erreurs.
			var noBr = SweetDevRia.DomHelper.getFirstChild (cell, "nobr");
			if (noBr) {
				// on passe tous les fils du nobr dans la cellule
				for (var i = 0; i < noBr.childNodes.length; i++) {
					cell.appendChild (noBr.childNodes [i]);
				}
							
				// on supprime le nobr
				SweetDevRia.DomHelper.removeNode (noBr);			
			}
			else {
				// on cree un nouveau tag nobr
				noBr = document.createElement("nobr");
				
				// on ajoute tous les fils de la cellule dans ce nobr
				for (var i = 0; i < cell.childNodes.length; i++) {
					noBr.appendChild (cell.childNodes [i]);
				}
				
				// on ajoute le nouveau nobr dans la cellule
				cell.appendChild (noBr);
			
			}
	
			col = this.getNextVisibleColumn (col);
		}
	}
}

/**
 * Swap the visibility of a grouping row bloc
 * 
 * @param {int}
 *            blocDescrIndex The index of the bloc to swap
 * @private
 */
SweetDevRia.Grid.prototype.swapRowBloc =  function (blocDescrIndex) {
	var dataGroup = this.getRowsForBloc (blocDescrIndex);
	var visible = null;
	
	for (var i = 0; i < dataGroup.length; i++) {
		var rowId = dataGroup [i][0];
		var row = SweetDevRia.DomHelper.get (this.id+"_tr_"+rowId);
		swapVisibility (row);
		var detail = SweetDevRia.DomHelper.get (this.id+"_tr_detail_"+rowId);
		swapVisibility (detail);
		
		if(visible==null){
			if(row){
				if(row.style.display == "none"){
					visible = false;
				}
				else{
					visible = true;
				}
			}
		}
	}
	
	var icon = SweetDevRia.DomHelper.get(this.id+"_groupHeader_"+blocDescrIndex+"_icon");
	if(!visible){
		SweetDevRia.DomHelper.addClassName(icon,"ideo-ndg-groupingIcon-closed");
	}
	else{
		SweetDevRia.DomHelper.removeClassName(icon,"ideo-ndg-groupingIcon-closed");
	}
	
	this.synchronizeHeader ();

	this.setResizable(this.resizable);
	
};

SweetDevRia.Grid.prototype.isRowVisible =  function (rowId) {
	if(!this.isTreeGrid){
		return true;
	}

	var tree = SweetDevRia.$ (this.treeModelId);
	if (tree) {
		var node = tree.getNode(rowId);
		
		if(!node && tree.loadingNode){
			node = tree.loadingNode.getChild(rowId);
		}
		
		if(node && node.toRender()){
			return true;
		}
	}
	
	return false;
};

SweetDevRia.Grid.prototype.renderTreeNode =  function (rowId) {
	var tree = SweetDevRia.$ (this.treeModelId);
	if (tree) {
		if (rowId == null || this.renderNode == null) {
			this.renderNode = tree.root;
		}
		else {
			if (tree.loading) {
				// SWTRIA-1236 : display all opened childs of the node
				this.renderNode = tree.getNode(rowId);
				if(!this.renderNode && tree.loadingNode){
					// SWTRIA-1198 : don't open a node previously loaded and
					// closed
					this.renderNode = tree.loadingNode.getChild(rowId);
				}
			}
			else {
				// SWTRIA-1220 : loading a tree already in session
				this.renderNode = this.renderNode.getNextNode ();
			}
		}
		
		var content = '';
		if(this.renderNode != null){
			this.renderNode.rowId = rowId;
			content = this.renderNode.renderContent (false);
		}
		return content;
	}
};

SweetDevRia.Grid.prototype.swapDetailVisibility =  function (rowId) {
	swapVisibility(document.getElementById(this.id+'_detail_'+rowId));

	var detailIcon = document.getElementById(this.id+"_"+rowId+"_detailIcon");
	var detailIconLeft = document.getElementById(this.id+"_"+rowId+"_detailIcon_left");
	var detailIconRight = document.getElementById(this.id+"_"+rowId+"_detailIcon_right");

	if (YAHOO.util.Dom.hasClass(detailIcon,"ideo-ndg-detailIconClose")) {
		YAHOO.util.Dom.removeClass(detailIcon,"ideo-ndg-detailIconClose");
		YAHOO.util.Dom.addClass(detailIcon,"ideo-ndg-detailIconOpen");
		
		YAHOO.util.Dom.removeClass(detailIconLeft,"ideo-ndg-detailIconClose");
		YAHOO.util.Dom.addClass(detailIconLeft,"ideo-ndg-detailIconOpen");
		
		YAHOO.util.Dom.removeClass(detailIconRight,"ideo-ndg-detailIconClose");
		YAHOO.util.Dom.addClass(detailIconRight,"ideo-ndg-detailIconOpen");
	}
	else if (YAHOO.util.Dom.hasClass(detailIcon,"ideo-ndg-detailIconOpen")) {
		YAHOO.util.Dom.removeClass(detailIcon,"ideo-ndg-detailIconOpen");
		YAHOO.util.Dom.addClass(detailIcon,"ideo-ndg-detailIconClose");
		
		YAHOO.util.Dom.removeClass(detailIconLeft,"ideo-ndg-detailIconOpen");
		YAHOO.util.Dom.addClass(detailIconLeft,"ideo-ndg-detailIconClose");
		
		YAHOO.util.Dom.removeClass(detailIconRight,"ideo-ndg-detailIconOpen");
		YAHOO.util.Dom.addClass(detailIconRight,"ideo-ndg-detailIconClose");
		
	}
	
	// SWTRIA-1225
	this.updateHeadDivForScroll();
	
	var frame =  this.getFrame();
	if (frame && frame.initialized) {
		frame.refreshBorders();
	}
};



/**
 * Compute minimum height of the grid
 * 
 * @return a value in pixel
 * @private
 */
SweetDevRia.Grid.prototype.getMinHeight =  function () {

	var result = this.minHeight;
	var sumPageBar = 0;

	var topPageBarContainer = document.getElementById (this.bottomPageBarId+"_container");
	if (topPageBarContainer) {
		var topPageBarHeight = SweetDevRia.DomHelper.getHeight (topPageBarContainer);
		if (topPageBarHeight > sumPageBar) {
			sumPageBar += topPageBarHeight; 
		}
	}			

	var bottomPageBarContainer = document.getElementById (this.bottomPageBarId+"_container");
	if (bottomPageBarContainer) {
		var bottomPageBarHeight = SweetDevRia.DomHelper.getHeight (bottomPageBarContainer);
		if (bottomPageBarHeight > sumPageBar) {
			sumPageBar += bottomPageBarHeight; 
		}
	}			

	if (sumPageBar > result) {
		result = sumPageBar; 
	}

	return result;
};

/**
 * Compute maximum height of the grid
 * 
 * @return a value in pixel
 * @private
 */
SweetDevRia.Grid.prototype.getMaxHeight =  function () {
	return this.maxHeight;
};

/**
 * Compute minimum width of the grid
 * 
 * @return a value in pixel
 * @private
 */
SweetDevRia.Grid.prototype.getMinWidth =  function () {
	/*
	 * srevel : je ne vois pas pourquoi on demande la largeur min de la barre de
	 * pagination, cela ne doit etre fait que pour la hauteur
	 */
	var pageBarContainer = document.getElementById (this.id+"_"+SweetDevRia.Grid.PAGEBAR+"_button");
	if (pageBarContainer) {
		var pageBarWidth = SweetDevRia.DomHelper.getWidth (pageBarContainer);
		if (pageBarWidth > this.minWidth) {
			return pageBarWidth; 
		}
	}

	return this.minWidth;
};

/**
 * Compute maximum width of the grid
 * 
 * @return a value in pixel
 * @private
 */
SweetDevRia.Grid.prototype.getMaxWidth =  function () {
	return this.maxWidth;
};


/**
 * Handle key events to modify selection
 * 
 * @param {Event}
 *            evt Key event
 * @private
 */
SweetDevRia.Grid.prototype.handleEvent =  function (evt) {
	if (this.isActive ()) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			var keyCode = evt.keyCode;
			switch(keyCode) {
				case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
				case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
				case SweetDevRia.KeyListener.ARROW_UP_KEY:
				case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					this.keySelection (evt);

					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);

					break;
				case SweetDevRia.KeyListener.SPACE_KEY:

					this.checkSelection ();

					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);

					break;
				default:
					break;
			}
		}
		if (evt.type == SweetDevRia.RiaEvent.SELECT_ALL) {

			this.selectAll ();

			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
		}
	}
};

SweetDevRia.Grid.prototype.setDataAsync = function (params) {
	if (params) {
		var data = params ["data"];
		var grid = SweetDevRia.$(data.id);					
		grid.actualPage = data.actualPage;
		grid.totalDataNumber = data.totalNumber;
		grid.setData(grid.initializedData);
		// SWTRIA-1117
		grid.setHeightIfNotSet();
		// SWTRIA-1303
		// pas besoin d'updater toutes les colonnes
		grid.updateLastColumnSize(grid.getGridWidth() - grid.columnSizeSum);
		// SWTRIA-1222
		grid.updateHeadDivForScroll();
	}
};


/**
 * SWTRIA-1306 Permet d'afficher ou non la barre de pagination du haut de facon
 * automatique
 * 
 * @private
 */
SweetDevRia.Grid.prototype.testIfTopPageBarIfNeeded = function () {
	if (this.showTopPageBarIfNeeded) {
		var container = document.getElementById (this.id+"_container");
		var gridHeight = SweetDevRia.DomHelper.getHeight (container);
		var visibleHeight = SweetDevRia.DomHelper.getClientHeight ();
		
		if (gridHeight < visibleHeight) {
			this.hidePageBar (this.topPageBarId);
		}
		else {
			this.showPageBar (this.topPageBarId);
		}
	}
}

/**
 * SWTRIA-1335 Permet d'afficher ou non la barre de scrolling de facon
 * automatique en fonction des cas
 * 
 * @param isRootNodeOpen {Boolean} vrai si le noeud root du TreeGrid est deploye
 */
SweetDevRia.Grid.prototype.testIfScrollBarNeeded = function (isRootNodeOpen) {
	// SWTRIA-1335 : ce code est la pour eviter une regression
	// ameliorer algos de resize pour le treegrid
	var divBody = SweetDevRia.DomHelper.get (this.id+"_bodyDiv");
	if (isRootNodeOpen) {
		SweetDevRia.DomHelper.setStyle(divBody, "overflow", "");
	}
	else {
		SweetDevRia.DomHelper.setStyle(divBody, "overflow", "hidden");
	}
}

SweetDevRia.Grid.prototype.templateExcelProperties = 
"\
<div>\
<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\"><legend class=\"ideo-ndg-legend\">${getMessage('exportMode')}</legend>\
	<input type=\"radio\" id=\"${id}_excelExport_wysiwyg\" name=\"${id}_excelExport_mode\" style=\"border:0px;\" value=\""+SweetDevRia.Grid.WYSIWYG_EXPORT+"\"/><label for=\"${id}_excelExport_wysiwyg\">${getMessage('wysiwygMode')}</label><br/>\
	<input type=\"radio\" id=\"${id}_excelExport_model\" name=\"${id}_excelExport_mode\" style=\"border:0px;\" value=\""+SweetDevRia.Grid.MODEL_EXPORT+"\"/><label for=\"${id}_excelExport_model\">${getMessage('modelMode')}</label><br/>\
</fieldset>\
{if displayCheckbox}\
<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\"><legend class=\"ideo-ndg-legend\">${getMessage('rowExportMode')}</legend>\
	<input type=\"checkbox\" id=\"${id}_excelExport_check\" checked style=\"border:0px;\"/><label for=\"${id}_excelExport_check\">${getMessage('exportOnlyChecked')}</label><br/>\
</fieldset>\
{/if}\
<div style=\"text-align:center\">\
	<button id=\"${id}_validExcel\" onclick=\"SweetDevRia.$('${id}').callExcelExport();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('excelExport')}</button>\
	<button id=\"${id}_cancelExcel\" onclick=\"SweetDevRia.$('${excelPropertiesWindowId}').close(); event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</div>\
</div>\
";


SweetDevRia.Grid.prototype.templateSortProperties = 
"\
<div>\
{for i in sortPropertiesDeep}\
	{if i != null}\
		<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\">\
		{if i == 0}\
			<legend class=\"ideo-ndg-legend\"><b><font size=\"+2\">${getMessage('sortBy')}</font></b></legend>\
		{else}\
			<legend class=\"ideo-ndg-legend\"><b><font size=\"+1\">${getMessage('sortAndBy')}</font></b></legend>\
		{/if}\
		<select id=\"${id}_sort${i}\" size=\"1\">\
		</select>\
		<input type=\"radio\" id=\"${id}_sort${i}_asc\" name=\"${id}_sort${i}_order\" value=\"ascendant\" style=\"border:0px;\"></input><label for=\"${id}_sort${i}_asc\">${getMessage('ascendant')}</label>\
		<input type=\"radio\" id=\"${id}_sort${i}_dsc\" name=\"${id}_sort${i}_order\" value=\"descendant\" style=\"border:0px;\"></input><label for=\"${id}_sort${i}_dsc\">${getMessage('descendant')}</label>\
		</fieldset>\
	{/if}\
{/for}\
<br/>\
<div style=\"text-align:center\">\
	<button id=\"${id}_validSort\" onclick=\"SweetDevRia.$('${id}').callMultipleColumnSort();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('sort')}</button>\
	<button id=\"${id}_cancelSort\" onclick=\"SweetDevRia.$('${sortPropertiesWindowId}').close();event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</div>\
</div>\
";


SweetDevRia.Grid.prototype.templateGridProperties = 
"<table width=\"100%\"><tr><td id=\"${id}_columns_visibility\" style=\"height: 100%;\"><div style=\"height: 100%;\">\
<fieldset style=\"height: 100%;\"><legend class=\"ideo-ndg-legend\">${getMessage('visibilityMenu')}</legend>\
<ul id=\"${id}_visibility_checkboxes\" class=\"ideo-ndg-checkList\"></ul>\
</fieldset></div></td><td id=\"${id}_columns_order\" style=\"height: 100%;\"><div style=\"height: 100%;\">\
<fieldset style=\"height: 100%;\"><legend class=\"ideo-ndg-legend\">${getMessage('gridPropertiesOrder')}</legend>\
	<div id=\"${id}_window_list_container\"></div>\
</fieldset></div></td></tr></table><br/><br/>\
<div style=\"text-align:center\">\
	<button id=\"${id}_validProp\" onclick=\"SweetDevRia.$('${id}').callApplyGridProperties();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('gridPropertiesOk')}</button>\
	<button id=\"${id}_cancelProp\" onclick=\"SweetDevRia.$('${gridPropertiesWindowId}').close();event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</div>\
";

SweetDevRia.Grid.prototype.templateGroupingProperties = 
"\
{for i in groupingPropertiesDeep}\
	<fieldset style=\"margin:5px\" class=\"ideo-ndg-winFieldSet\">\
	{if i == 0}\
		<legend class=\"ideo-ndg-legend\"><b><font size=\"+2\">${getMessage('groupBy')}</font></b></legend>\
	{else}\
		<legend class=\"ideo-ndg-legend\"><b><font size=\"+1\">${getMessage('groupAndBy')}</font></b></legend>\
	{/if}\
	<select id=\"${id}_group_${i}\" size=\"1\">\
	</select>\
	</fieldset>\
{/for}\
<br/>\
<div style=\"text-align:center\">\
	<button id=\"${id}_validGroup\" onclick=\"SweetDevRia.$('${id}').callGrouping();event.cancelBubble = true;\" class=\"ideo-exp-validateButton\">${getMessage('group')}</button>\
	<button id=\"${id}_cancelGroup\" onclick=\"SweetDevRia.$('${groupingPropertiesWindowId}').close();event.cancelBubble = true;\" class=\"ideo-exp-cancelButton\">${getMessage('cancel')}</button>\
</div>\
";


/**
 * Test d'une page barre avec select des pages, nombre total de page, select de
 * nombre de ligne par page SWTRIA-1306
 */
SweetDevRia.Grid.prototype.templatePageBar = 
"\
{if showTotalPageNumber == true}\
<div id=\"${id}_totalDataNumber\" style=\"line-height:24px;float:left;\">\
	${totalDataNumber} ${getMessage('item')} on ${pageNumber} page(s)\
</div>\
{/if}\
{if canChangeItemPerPage == true}\
<div id=\"${id}_changeItemPerPage\" style=\"line-height:24px;float:right\">\
	<select onchange=\"SweetDevRia.$('${linkedId}').changeItemPerPage(this.value);\">\
 		<option>5</option>\
 		<option {if rowPerPage == 10}selected {/if}>10</option>\
 		<option {if rowPerPage == 20}selected {/if}>20</option>\
 		<option {if rowPerPage == 50}selected {/if}>50</option>\
 		<option {if rowPerPage == 100}selected {/if}>100</option>\
	</select>&nbsp;/&nbsp;page\
</div>\
{/if}\
	{if pageNumber > 1}\
	{if pageBarMode == SweetDevRia.Grid.SELECT_PAGINATION_MODE}\
		<div id=\"${id}\" style=\"line-height:24px;margin-left:auto;margin-right:auto;text-align:center\">\
		<select onchange=\"SweetDevRia.$('${id}').goToPageEvt(event, parseInt(this.value));return false;\">\
		{for num in visiblePageNumberArray}\
	 		<option value=\"${num}\" {if actualPage == num}selected {/if} >${formatPageNumber(num)}</option>\
	 	{/for}\
		</select>&nbsp;/&nbsp;${pageNumber}&nbsp;\
		<div id=\"${id}\" style=\"line-height:24px;margin-left:auto;margin-right:auto;text-align:center\">\
	{else}\
	"+SweetDevRia.PageBar.prototype.template+"\
	{/if}\
	{/if}\
";


SweetDevRia.Grid.prototype.templateTopPageBar = SweetDevRia.Grid.prototype.templatePageBar;
SweetDevRia.Grid.prototype.templateBottomPageBar = SweetDevRia.Grid.prototype.templatePageBar;
		

