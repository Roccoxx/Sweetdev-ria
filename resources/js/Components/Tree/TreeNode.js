/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006 - 2010] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
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
 *        92800 Puteaux - Francef
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
* This is the TreeNode component class 
* The constructor is in charge of adding the node to its parent
* @param {String} id Id of this tree node
* @param {String} label Label of this node
* @param {TreeNode} parentNode The parent node of this node, or null if root
* @param {NodeType} nodeType The node type of this node.
* @param {int} position The position of this node in its parent. 
* @constructor
*/
SweetDevRia.TreeNode = function(id, label, parentNode, nodeType, position, tooltip){
	
	this.id = id;
	this.label = label;
	this.parentNode = parentNode;
	
	this.nodeType = nodeType;
	if(!nodeType){
		SweetDevRia.log.error('Incorrect NodeType for TreeNode id:'+id);
		throw('Incorrect NodeType for TreeNode id:'+id);
	}

	this.isOpen = false;
	
	/* boolean indicating if the noad is being loaded or not 
	Avoid simultaneously multiple requests for a single node content
	*/
	this.loading = false;
	
	this.children = null;
	
	this.information = null;
	this.iconStyle = null;
	this.style = null;
	this.styleClass = null;
	this.selected = false;
	this.tooltip = tooltip;	
	
	if (this.parentNode) {
		this.isRoot = false;
		this.parentNode.addChild (this, position);
		this.level = parentNode.level + 1;
		this.displayNode = true;
	}
	else {
		this.isRoot = true;
		this.level = 0;
	}
	
	this.checked = false;
};

/**
 * Constants for DOM node generation
 */
SweetDevRia.TreeNode.DIV_SUFFIXE = "_div";
SweetDevRia.TreeNode.LASTINDENT_SUFFIXE = "_lastIndent";
SweetDevRia.TreeNode.ICON_SUFFIXE = "_icon";
SweetDevRia.TreeNode.CHECK_SUFFIXE = "_check";
SweetDevRia.TreeNode.LABEL_SUFFIXE = "_label";
SweetDevRia.TreeNode.LABEL_A_SUFFIXE = "_a_label";


/* Public APIS */
/**
 * This method is called before selecting this node
 * To be overridden !!
 * @param {boolean} notify true if the notification of the server must be performed, false otherwise (restoration action).
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeSelect  = function(notify){  /* override this */ return true;  };

/**
 * This method is called after selecting this node
 * @param {boolean} notify true if the notification of the server must be performed, false otherwise (restoration action).
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterSelect = function(notify){  /* override this */ };


/**
 * This method is called before unselecting this node
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeUnselect  = function(){  /* override this */ return true;  };

/**
 * This method is called after unselecting this node
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterUnselect = function(){  /* override this */ };

/**
 * This method is called before collapsing this node
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeCollapse  = function(){  /* override this */ return true;  };

/**
 * This method is called after collapsing this node
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterCollapse = function(){  /* override this */ };

/**
 * This method is called before expanding this node
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeExpand  = function(){  /* override this */ return true;  };

/**
 * This method is called after expanding this node
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterExpand = function(){  /* override this */ };


/**
 * This method is called before checking this node
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeCheck  = function(){  /* override this */ return true;  };

/**
 * This method is called after checking this node
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterCheck = function(){  /* override this */ };

/**
 * This method is called before unchecking this node
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.beforeUncheck  = function(){  /* override this */ return true;  };

/**
 * This method is called after unchecking this node
 * To be overridden !!
 */
SweetDevRia.TreeNode.prototype.afterUncheck = function(){  /* override this */ };


SweetDevRia.TreeNode.prototype.afterInitialize = function(){  /* override this */ };


/**
* Returns the id of this node.
* @return the if of this node.
* @type String
*/
SweetDevRia.TreeNode.prototype.getId = function(){
	return this.id;
};

/**
* Returns the label of this node.
* @return the label of this node.
* @type String
*/
SweetDevRia.TreeNode.prototype.getLabel = function(){
	return this.label;
};

/**
* Returns the children of this node, an empty Array if this node has no child, or null if for a leaf or if the nodes are not loaded.
* @return the children of this node.
* @type String
*/
SweetDevRia.TreeNode.prototype.getChildren = function(){
	return this.children;
};

/**
* Adds a child to this node, at the specified position.
* Does nothing if the node type is set as a leaf
* @param {TreeNode} child the child to add
* @param {int} position the position to add 
*/
SweetDevRia.TreeNode.prototype.addChild = function(child, position){
	if (! this.isLeaf()) {
		if (this.children == null) {
			this.children = [];
		}
		
		if (position == null) {
			this.children.add (child);
		}
		else {
			this.children.insertAt (child, position);		
		}
		child.initTree(this.tree);
	}
};

/**
* Returns true if this node has, or may have some children (loaded or not)
* @return true if this node has or may have children
* @type boolean 
*/
SweetDevRia.TreeNode.prototype.hasChildren = function(){
	return (!this.isLeaf() && (this.children == null || this.children.length > 0));
};

/**
* Returns the searched Node or null if not found
* @return the searched Node or null if not found
* @type TreeNode
*/
SweetDevRia.TreeNode.prototype.getChild = function(nodeId){
	if(!this.isLeaf() && this.children && this.children.length > 0){
		for(var i=0;i<this.children.length;i++){
			if(this.children[i].id==nodeId){
				return this.children[i];
			}
		}
	}
	return null;
};

/**
* Set a node type for this node.
* Every modification will be performed by this function, regarding the incompatibilities on the previous and the new node types.
* This means removing the children if the leaf state goes to false...
*/
SweetDevRia.TreeNode.prototype.setNodeType = function(nodeType){
	if(this.nodeType.id != nodeType.id){
		var exNodeType = this.nodeType;
		if(nodeType.leaf != exNodeType.leaf){//leaf state changed
			if(!this.isLeaf()){//leaf turn to true : delete all
				this.tree.deleteChildNodes(this.id);
			}
		}
		if(nodeType.displayCheckbox != exNodeType.displayCheckbox){
			if(this.hasChildStateChecked(true) && !this.hasChildStateChecked(false)){
				this.check(); 
			}
		}
		this.nodeType = nodeType;
		this.refresh();
	}
};

/**
 * Return the node type of the node
 * @return the node type of the node
 * @type NodeType
 */
SweetDevRia.TreeNode.prototype.getNodeType = function(){
	return this.nodeType;
};

/**
 * Return the leaf state of the node, according to its node type
 * @return the leaf state of the node
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.isLeaf = function(){
	return this.nodeType.leaf;
};

/**
 * Return true if the node is the last one of the tree view (the bottom one)
 * @return true if the node is the last one of the tree view (the bottom one)
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.isLastTreeNode = function(){
	return this.getPreviousNode() && !this.getNextNode();
};

/**
 * Initiate the tree object pointer for this node
 * @param {Tree} tree the tree to initiate
 * @private
 */
SweetDevRia.TreeNode.prototype.initTree = function(tree){
	this.tree = tree;
	
	if(this.hasChildren() && (this.children != null)){
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].initTree(tree);
		}
	}	
};



/**
 * Initialize the Drag and Drop for this node
 * @param {boolean} recursiv a boolean indicating if the Drag and Drop should be propagated to the children
 * @private
 */
SweetDevRia.TreeNode.prototype.initDD = function(recursiv){

	this.tree.addNodeDD(this.id);
	
	if(recursiv){
		if(this.hasChildren() && (this.children!=null)){
			for(var i=0;i<this.children.length;++i){
				this.children[i].initDD(true);
			}
		}
	}
	
	this.afterInitialize ();
};

/**
 * Return true if the node is the last child of its parent
 * @return Return true if the node is the last child of its parent
 * @type {boolean}
 */
SweetDevRia.TreeNode.prototype.isLastChild = function(){
	if (this.parentNode) {
		var lastChild = this.parentNode.children[this.parentNode.children.length - 1];
		return (lastChild.id == this.id);
	}
	else {
		return true;
	}
};

/**
 * Return the index of this node in its parent, or null if this node has no parent
 * @return the index of this node in its parent
 * @type {int}
 */
SweetDevRia.TreeNode.prototype.getIndexChild = function(){
	if (this.parentNode) {
		var children = this.parentNode.children;
		
		if (children) {
			for (var i = 0; i < children.length; i++) {
				if (children[i].id == this.id) {
					return i;
				}
			}
		}
	}
	
	return null;
};

/**
 * Return the previous node in the tree view. This method goes cross nodes and across levels.
 * Used mostly for the navigation
 * @return the previous node in the tree view.
 * @type {TreeNode}
 */
SweetDevRia.TreeNode.prototype.getPreviousNode = function(){
	
	function SweetDevRia_getLastVisibleChild (node) {
		if (node && !node.isLeaf() && node.children && node.children.length && node.isOpen) {
			var lastChild = node.children [node.children.length - 1];
			return SweetDevRia_getLastVisibleChild (lastChild);
		}
		else {
			return node;
		}
	}
	
	var index = this.getIndexChild ();

	if (index == 0) {
		return this.parentNode;
	}
	else {
		if (this.parentNode) {
			return SweetDevRia_getLastVisibleChild (this.parentNode.children [index - 1]);
		}
	}
};

/**
 * Return the next node in the tree view. This method goes cross nodes and across levels.
 * Used mostly for the navigation
 * @return the next node in the tree view.
 * @type {TreeNode}
 */
SweetDevRia.TreeNode.prototype.getNextNode = function(){

	function SweetDevRia_getParentNextNode (node) {
		if (node == null) {
			return null;
		}
		var index = node.getIndexChild ();
		
		if (node.isLastChild ()) {
			return SweetDevRia_getParentNextNode (node.parentNode);
		}
		else {
			return node.parentNode.children [index + 1];
		}
	}
	
	var index = this.getIndexChild ();

	if (!this.isLeaf() && (this.isOpen || (this.tree.isTreeGrid && this.tree.loading)) && this.children && this.children.length) {
		return this.children [0];	
	}
	else if (this.isLastChild ()) {
		return SweetDevRia_getParentNextNode (this.parentNode);
	}
	else {
		return this.parentNode.children [index + 1];
	}
};

/**
 * Perform a selection on this node. If a node was previously selected, it turns to unselected.
 * @param {boolean} notify true if the notification of the server must be performed, false otherwise (restoration action).
 */
SweetDevRia.TreeNode.prototype.select = function(notify){
	var oldSelect = this.tree.selectNode;
	if (oldSelect != null) {
		if (oldSelect == this){
			return;
		}

		oldSelect.unselect ();
	}
	
	if(this.beforeSelect(notify)){
		
		this.tree.selectNode = this;

		if (! this.tree.isTreeGrid) {
			var div = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.DIV_SUFFIXE);
			SweetDevRia.DomHelper.addClassName(div,"ideo-tre-selected");
			if (! browser.isIE) {
				SweetDevRia.DomHelper.get(this.tree.id+"_"+this.id+SweetDevRia.TreeNode.LABEL_A_SUFFIXE).focus();
			}
		}

		
		if(notify == true){
			var params = {"nodeId":this.id};
			var riaEvent = new SweetDevRia.RiaEvent ("select", this.tree.id, params);
					
			SweetDevRia.ComHelper.stackEvent(riaEvent);
		}
	
		this.tree.onSelect (this); 

		this.afterSelect(notify);	
	}
};

/**
 * Perform an unselection on this node.
 */
SweetDevRia.TreeNode.prototype.unselect = function(){
	if(this.beforeUnselect()){

		if (! this.tree.isTreeGrid) {
			var div = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.DIV_SUFFIXE);
			SweetDevRia.DomHelper.removeClassName(div,"ideo-tre-selected");
		}	
		this.afterUnselect();
	}	
};

/**
 * Alternates color of the nodes placed after the current node
 */
SweetDevRia.TreeNode.prototype.alternateNodeStyle = function () {
	if (!this.isRoot) {
		var nextNode = this.getNextNode();
		var trNode = SweetDevRia.DomHelper.get(this.tree.gridId + "_tr_" + this.id);
		var isParentParStyle = SweetDevRia.DomHelper.hasClassName(trNode, "ideo-ndg-parRow");
		
		while (nextNode!=null) {
			var tableNode = SweetDevRia.DomHelper.get(this.tree.gridId + "_table_" + nextNode.id);
			var display = SweetDevRia.DomHelper.getStyle (tableNode, "display");
			
			if (display!="none") {
				trNode = SweetDevRia.DomHelper.get(this.tree.gridId + "_tr_" + nextNode.id);
				isParStyle = SweetDevRia.DomHelper.hasClassName(trNode, "ideo-ndg-parRow");
				if (isParentParStyle) {
					SweetDevRia.DomHelper.removeClassName(trNode, "ideo-ndg-parRow");
					SweetDevRia.DomHelper.addClassName(trNode, "ideo-ndg-oddRow");
				}
				else {
					SweetDevRia.DomHelper.removeClassName(trNode, "ideo-ndg-oddRow");
					SweetDevRia.DomHelper.addClassName(trNode, "ideo-ndg-parRow");
				}
				isParentParStyle = !isParentParStyle;
			}
			nextNode = nextNode.getNextNode();
		}
	}
};

/**
 * Collapse this node. Does nothing on leaf or if the node is already collapsed.
 */
SweetDevRia.TreeNode.prototype.collapse = function(){
	if (this.isLeaf() || ! this.isOpen){
		return;
	}
	
	if(this.beforeCollapse()){
		
		var div = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.DIV_SUFFIXE);
		var lastIndent = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
		var children = document.getElementById (this.tree.id+"_"+this.id+ "_children");
	
		SweetDevRia.DomHelper.removeClassName(lastIndent, this.getLastIndentationClass());
	
		SweetDevRia.DomHelper.addClassName(div,"ideo-tre-collapseNode");
		SweetDevRia.DomHelper.removeClassName(div,"ideo-tre-expandNode");	
	
		if (this.tree.isTreeGrid) {
			// TODO hide all children rows
			var nextNode = this.getNextNode ();
		
			var nextBrother = null; 
			if (! this.isLastChild ()) {
				var index = this.getIndexChild ();
				nextBrother = this.parentNode.children [index + 1];
			}
			
			// Correction SWTRIA-728
			while (nextNode != null && nextNode != nextBrother && nextNode.level > this.level) {
				// Tree grid update rowId information on registered nodes, not guenuin children node
				var rowId = this.tree.nodes[nextNode.id].rowId; // SWTRIA-1313 
				var row = SweetDevRia.DomHelper.get (this.tree.gridId+"_tr_"+rowId);
				if (row && row.parentNode && row.parentNode.parentNode) {
					swapVisibility (row.parentNode.parentNode); // SWTRIA-1313 
				}
				var detail = SweetDevRia.DomHelper.get (this.tree.gridId+"_tr_detail_"+rowId);
				swapVisibility (detail);
	
				if(!nextNode.isLastChild() || nextBrother!=null){
					nextNode = nextNode.getNextNode ();
				}else if(nextNode.isLastChild() && (nextNode.level>(this.level+1) || nextNode.hasChildren()) ){
					nextNode = nextNode.getNextNode ();
				}
				else{
					nextNode = null;
				}		
			}
			this.alternateNodeStyle();
		}
		else {
			children.style.display = "none";
		}
	
		this.isOpen = false;
	
		var params = {"nodeId":this.id, "expanded":false};
		var riaEvent = new SweetDevRia.RiaEvent ("swap", this.tree.id, params);
		
		SweetDevRia.ComHelper.stackEvent(riaEvent);
	
		SweetDevRia.DomHelper.addClassName(lastIndent, this.getLastIndentationClass());
		
		// SWTRIA-1335
		if (this.tree.isTreeGrid) {
			SweetDevRia.$(this.tree.gridId).testIfScrollBarNeeded(this.tree.root.isOpen);
		}
		
		this.afterCollapse();
	}
};

/**
 * Expand this node and all its children. Does nothing on leaf or if the node has no children loaded.
 */
SweetDevRia.TreeNode.prototype.expandAll = function(){
	if (! this.isLeaf() && this.children) {
		this.expand ();
		
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children [i];
			child.expandAll ();			
		}
	}
};

/**
 * Expand this node. Does nothing on leaf or if the node is already open.<b> 
 * Process an Ajax request to the server if this node is not loaded yet.
 */
SweetDevRia.TreeNode.prototype.expand = function(){
	if (this.isLeaf() || this.isOpen){
		return;
	}

	if(this.beforeExpand()){
		// SWTRIA-1313 
		// In some case HTML representation of previously visble node (but now hidden)
		// could be erased.
		if (this.tree.isTreeGrid && this.children !== null && !this.loading) {
			// check is children node rows have been erased.
			var firstChild = this.children[0];
			var firstChildDiv = SweetDevRia.DomHelper.get(this.tree.id+"_"+firstChild.id +"_div");
			if (!firstChildDiv ) {
				// children node rows have been erased.
				this.children = null;
			}
		}

		
		if (this.children == null) {
			this.tree.loadNode(this);
		}
		else {
			var div = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.DIV_SUFFIXE);
			var lastIndent = document.getElementById (this.tree.id+"_"+this.id+ SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
			var children = document.getElementById (this.tree.id+"_"+this.id+ "_children");
			
			SweetDevRia.DomHelper.removeClassName(lastIndent, this.getLastIndentationClass());
			
			SweetDevRia.DomHelper.addClassName(div,"ideo-tre-expandNode");
			SweetDevRia.DomHelper.removeClassName(div,"ideo-tre-collapseNode");
			
			this.isOpen = true;
		
			if (this.tree.isTreeGrid) {
				// TODO show all children rows
				var nextNode = this.getNextNode ();
			
				var nextBrother = null; 
				if (! this.isLastChild ()) {
					var index = this.getIndexChild ();
					nextBrother = this.parentNode.children [index + 1];
				}
			
				// Correction SWTRIA-728
				while (nextNode != null && nextNode != nextBrother && nextNode.level > this.level) {
					// Tree grid update rowId information on registered nodes, not guenuin children node
					// SWTRIA-1313 
					var child = this.tree.getNode(nextNode.id); //may be not yet registered. 
					if (child) {
						var rowId = child.rowId;
						var row = SweetDevRia.DomHelper.get (this.tree.gridId+"_tr_"+rowId);
						if (row && row.parentNode && row.parentNode.parentNode) {
							swapVisibility (row.parentNode.parentNode); // MANTIS 10
						}						
					}

					var detail = SweetDevRia.DomHelper.get (this.tree.gridId+"_tr_detail_"+rowId);
					swapVisibility (detail);
					
					if(!nextNode.isLastChild() || nextBrother!=null){
						nextNode = nextNode.getNextNode ();
					}else if(nextNode.isLastChild() && (nextNode.level>(this.level+1) || nextNode.hasChildren()) ){
						nextNode = nextNode.getNextNode ();
					}else{
						nextNode = null;
					}
				}
				this.alternateNodeStyle();
			}
			else if (this.children.length > 0) {
				children.style.display = "block";
			}
			
			//perform a selection that might be needed
			if(this.tree.newSelectNode && !this.tree.selectNode && this.isParent(this.tree.newSelectNode)){
				this.tree.newSelectNode.select(false);
				this.tree.newSelectNode = null;
			}
			
			var params = {"nodeId":this.id, "expanded":true};
			var riaEvent = new SweetDevRia.RiaEvent ("swap", this.tree.id, params);
		
			SweetDevRia.ComHelper.stackEvent(riaEvent);
			
			SweetDevRia.DomHelper.addClassName(lastIndent, this.getLastIndentationClass());
		}
		
		// SWTRIA-1335
		if (this.tree.isTreeGrid) {
			SweetDevRia.$(this.tree.gridId).testIfScrollBarNeeded(this.tree.root.isOpen);
		}
		
		this.afterExpand();	
	}
};

/**
 * Swap the visibility state of this node.
 */
SweetDevRia.TreeNode.prototype.swapCollapse = function(){
	if (this.isOpen) {
		this.collapse ();		
	}
	else {
		this.expand ();
	}
};

/**
 * Redefine this method to bind an action on this node icon
 */
SweetDevRia.TreeNode.prototype.iconAction = function(){
};

/**
 * Redefine this method to bind an action on this node label
 */
SweetDevRia.TreeNode.prototype.labelAction = function(){
};

/**
 * Returns the identation array as it must be displayed to render a hierarchy.Stops before the icon render
 * @return the identation array as it must be displayed to render a hierarchy
 * @type Array
 * @private
 */
SweetDevRia.TreeNode.prototype.getIndentationArray = function(){
	var arr = [];
	if (this.level >= 1) {
		arr = new Array ();
		var parent = this.parentNode;
		
		for (var i = this.level - 1; i >= 0 ; i--) {
			arr.add( ! parent.isLastChild () );
			parent = parent.parentNode;
		}
	}

	return arr.reverse ();
};


/**
 * Refresh the indentation images (vertical line or blank image). Recursiv function.
 * @private
 */
SweetDevRia.TreeNode.prototype.refreshIndentationImages = function(recursiv){
	var indentArray = this.getIndentationArray();
	
	for(var i=0;i<indentArray.length;++i){
		var img = document.getElementById(this.tree.id+"_"+this.id+"_"+i);
		img.className = "ideo-tre-images";
		if(indentArray[i] == true){
			SweetDevRia.DomHelper.addClassName(img, "ideo-tre-iconLine");
		}	
	}

	if(recursiv && this.hasChildren() && (this.children != null)){
		for (var i = 0; i < this.children.length; i++) {
			this.children [i].refreshIndentationImages (true);			
		}
	}
};

/**
 * Refresh the last indentation images (+/-) of this node.
 * @private
 */
SweetDevRia.TreeNode.prototype.refreshLastIndentationClass = function(){
	var img = document.getElementById (this.tree.id+"_"+this.id+SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
	if (img) {
		var newCss = this.getLastIndentationClass ();
		img.className = "ideo-tre-images";
		SweetDevRia.DomHelper.addClassName(img, newCss);
		
		
	}
};

/**
 * Set a label on this node
 */
SweetDevRia.TreeNode.prototype.setLabel = function(label){
	this.label = label;
	
	var labelComp = SweetDevRia.DomHelper.get (this.tree.id+"_"+this.id+SweetDevRia.TreeNode.LABEL_SUFFIXE);
	if (labelComp) {
		labelComp.innerHTML = label;
	}
};

/**
 * Modify the label and transmit this modification to the server
 * @param {String} label The new label of the node
 * @param {String} nodeType The id of the new type of node 
 */
SweetDevRia.TreeNode.prototype.modifyNode = function (label,nodeType) {
	this.setLabel (label);		
	if(nodeType){
		this.setNodeType(this.tree.getNodeType(nodeType));
	}
	
	var params = {"nodeId":this.id, "label":label, "nodeTypeId":nodeType};
	var riaEvent = new SweetDevRia.RiaEvent ("modify", this.tree.id, params);
	
	SweetDevRia.ComHelper.stackEvent(riaEvent);
};

/**
 * Return the state check of this node.
 * @return true if the node is checked, false otherwise
 * @type boolean 
 */
SweetDevRia.TreeNode.prototype.isChecked = function(){
	return this.checked;
};

/**
 * Return the generic information map sent by the server for this node, or null if none have been defined
 * @return the generic information map sent by the server for this node
 * @type Map
 */
SweetDevRia.TreeNode.prototype.getInformation = function(){
	return this.information;
};

/**
 * Return true if this node is a parent of the one given in parameter. Recursiv function.
 * @param {TreeNode} node the node tested as a child of this one
 * @return true if this node is a parent of the one given in parameter
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.isParent = function(nodeDescent){

	// if node has no children, it couldn't be the parent od nodeDescent.
	if(!this.hasChildren() || (this.children == null)){
		return false;
	}

	// Root is ancestor of every other nodes.
	if (!this.parentNode ) {
		return true;
	}
			
	// Root node has no ancestor.
	if (!nodeDescent.parentNode) {
		return false;
	}
	
	// A node is not its own ancestor
	if (nodeDescent.id == this.id) {
		return false;
	}
	
	while (nodeDescent) {
		// If node Ancestor is the parent of nodeDescent then it is its anector.
		if (nodeDescent.parentNode && this.id == nodeDescent.parentNode.id) {
			return true;
		}
		
		nodeDescent = nodeDescent.parentNode;
	}
	
	return false;
};

/**
 * Return true if one of this node child has this checked state
 * @param {boolean} state the check state to look for
 * @return true if one of this node child has this checked state, false otherwise
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.hasChildStateChecked = function(state){	
	if(this.isCheckable()){
		if(this.isChecked()==state){
			return true;
		}
		else{
			return false;
		}
	}
	
	if(this.isLeaf() || this.children == null){
		return false;
	}

	for(var i=0;i<this.children.length;++i){
		if(this.children[i].hasChildStateChecked(state)){
			return true;
		}	
	}
	return false;
};

/**
 * Return true if this node can be checked, according to its node type value
 * @return true if this node can be checked, according to its node type value, false otherwise
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.isCheckable = function(){
	return this.nodeType.displayCheckbox;
};

/**
 * Perform a check on this node. Check all this node's children
 * @param {boolean} verifiyParent A boolean indicating if the parent must be verified for a check on this node check. Avoid circles.
 * @param {boolean} sendEvent (true by default) A boolean indicating an event must be sent to server to update model. Avoid circles.
 */
SweetDevRia.TreeNode.prototype.check = function(verifyParent, sendEvent){
	if (this.checked) {
		return;
	}

	if(this.beforeCheck()){
	
		if (verifyParent == null) {
			verifyParent = true;
		}
	
		if (sendEvent == null) {
			sendEvent = true;
		}
		
		this.checked = true;
	
		var check = document.getElementById (this.tree.id+"_"+this.id+SweetDevRia.TreeNode.CHECK_SUFFIXE);
		if (check) {
			check.checked = true;
		}
		
		if (! this.isLeaf() && this.children) {
			// check parent => check children
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children [i];
				if (! child.checked) {
					child.check (false, false); /* don't send event when checking children */
				}
			}
		}
		
		if (this.parentNode && verifyParent) {
			// check a child => verify parent check
			var areAllChecked = true; 
			for (var i = 0; i < this.parentNode.children.length; i++) {
				var child = this.parentNode.children [i];
				if (!child.checked){//a child not checked
					if(child.hasChildStateChecked(false)) {//this child got some unchecked children
						areAllChecked = false;
						break;
					}
				}
			}	
			if (areAllChecked) {
				this.parentNode.check (true, sendEvent);		
				sendEvent = false; /* No more send event for this node - Parent will do*/ 
			}
		}
		
		if (sendEvent)  {
			this.sendCheckUncheckNode(true, ! this.isLeaf());
		}
	
		this.afterCheck();
	}
};

/**
 * Perform an uncheck on this node.
 * @param {boolean} uncheckChildren A boolean indicating if the children must be unchecked to.
 * @param {boolean} sendEvent (true by default) A boolean indicating an event must be sent to server to update model. Avoid circles.
 */
SweetDevRia.TreeNode.prototype.uncheck = function(uncheckChildren, sendEvent){
	if (! this.checked) {
		return;
	}

	if(this.beforeUncheck()){	
	
		if (uncheckChildren == null) {
			uncheckChildren = true;
		}
	
		if (sendEvent == null) {
			sendEvent = true;
		}
	
	
		var check = document.getElementById (this.tree.id+"_"+this.id+SweetDevRia.TreeNode.CHECK_SUFFIXE);
		if (check) {
			check.checked = false;
		}
		this.checked = false;
		
		if (uncheckChildren && ! this.isLeaf() && this.children) {
			// on decoche un pere , dc on decoche ts ses fils
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children [i];
				if (child.checked) {
					child.uncheck (uncheckChildren, false); /* don't send event when unchecking children */				
				}
			}
		}
		
		if (this.parentNode) {
			// on decoche un fils, dc on decoche le pere
			this.parentNode.uncheck (false, false /* don't send event */);		
		}
	
	
		if (sendEvent)  {
			this.sendCheckUncheckNode(false, uncheckChildren);
		}
	
		this.afterUncheck();
	}	
};


/**
 * 
 */
SweetDevRia.TreeNode.prototype.sendCheckUncheckNode = function(checked, propagateToChilds) {
	var params = {"nodeId": this.id, "checked":checked, "propagateToChilds":propagateToChilds};
	var riaEvent = new SweetDevRia.RiaEvent ("checkUnCheckNodes", this.tree.id, params);
	SweetDevRia.ComHelper.fireEvent(riaEvent, false);
};


/**
 * Swap the check state of this node
 */
SweetDevRia.TreeNode.prototype.swapCheck = function(){
	if (this.isChecked ()) {
		this.uncheck();		
	}
	else {
		this.check();		
	}
};

/**
 * Return the last indentation className, used of the DOM render
 * @return the last indentation className, used of the DOM render
 * @type String
 * @private
 */
SweetDevRia.TreeNode.prototype.getLastIndentationClass = function(){
	var className = "ideo-tre-";
	
	if (this.hasChildren ()) {
		if (this.isOpen) {
			className += "minus";
		}
		else {
			className += "plus";
		}		
	}
	else {
		className += "normal";
	}

	if (this.isLastChild ()) {
		className += "Last";
	}

	return className;
};

/**
 * Refreshes the content of the node and its children by redrawing the content of its container
 * @param {boolean} reload If true, all children are clear and so reload from server.
 */
SweetDevRia.TreeNode.prototype.refresh = function(reload){
	if (reload == true) {
		this.children = null;
		this.loading = false;
		this.tree.loadNode(this);
	}
	else {
		var liContainer = document.getElementById(this.tree.id+"_"+this.id+"_li");
		if(liContainer){
			liContainer.innerHTML = this.renderContent();
		}
	}

};

/**
 * Tell if the node should be rendered
 * @return true if the node has to be render (for the treegrid)
 * @type boolean
 */
SweetDevRia.TreeNode.prototype.toRender = function(){
	if(this.parentNode){
		var parent = this.parentNode;
		while(parent){
			if(!parent.isOpen){
				return false;
			}
			parent = parent.parentNode;
		}
	}
	return true;
};

/**
 * Render the node, and its children
 * @return the DOM string corresponding to this node 
 * @type String
 * @private
 */
SweetDevRia.TreeNode.prototype.render = function(){
	var str =  TrimPath.processDOMTemplate(this.template, this);
	return str;
};

/**
 * Render the content of the node (excluding the container), and its children
 * @return the DOM string corresponding to this node's content
 * @type String
 * @private
 */
SweetDevRia.TreeNode.prototype.renderContent = function(drawChildren){
	if (drawChildren == null) {
		drawChildren = true;
	}

	if (! this.isLeaf() && this.children == null && ! drawChildren) {
		this.isOpen = false;
	}

	this.tree.register (this);

	if(this.isRoot){
		this.displayNode = this.tree.displayRoot;
		if(!this.displayNode){
			this.isOpen = true;
		}
	}

	var str =  TrimPath.processDOMTemplate(this.templateContent, this);
	if (drawChildren) {
		str +=  TrimPath.processDOMTemplate(this.templateChildren, this);
	}
	return str;
};


/**
 * Update the render of the icon of this node according to its loading state
 * @private
 */
SweetDevRia.TreeNode.prototype.updateIconRender = function(){
	var icon = document.getElementById(this.tree.id+"_"+this.id+SweetDevRia.TreeNode.ICON_SUFFIXE);
	if(icon){
		icon.className = "ideo-tre-images";
		if(this.loading){
			if(this.iconStyle){
				this.iconBackgroundBkp = icon.style.background;
				icon.style.backgroundImage = "";
			}
			SweetDevRia.DomHelper.addClassName(icon, "ideo-tre-loading");
		}else{
			SweetDevRia.DomHelper.addClassName(icon, this.nodeType.iconClass);
			if(this.iconStyle){
				icon.style.background = this.iconBackgroundBkp;
				this.iconBackgroundBkp = null;
			}
		}
	}
};

/**
 * Render the children of this node, returning the DOM string
 * @return the DOM string corresponding to this node's children content
 * @type String
 * @private
 */
SweetDevRia.TreeNode.prototype.getChildrenRender = function(){
	var str = "";

	if (this.children) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children [i];
			str += child.render ();
		}
	}

	return str;
};

/**
 * Render the children of this node in HTML. Do not re-render this current node.
 * @param {boolean} initDD a boolean indicating if the Drag and Drop must be initialized or not
 */
SweetDevRia.TreeNode.prototype.drawChildren = function(initDD){
	var ul = document.getElementById (this.tree.id+"_"+this.id+"_children");
	if (ul) {
		ul.innerHTML = this.getChildrenRender ();

		if(this.hasChildren() && (this.children!=null)){
			for(var i=0;i<this.children.length;++i){
				if(initDD){
					this.children[i].initDD(true);
				}
			}
		}			
	}
	
	SweetDevRia.init ();
};


SweetDevRia.TreeNode.prototype.template = "\
<li id=\"${tree.id}_${id}_li\" class=\"ideo-tre-li\">\
${renderContent()}\
</li>\
";

SweetDevRia.TreeNode.prototype.templateContent = "\
	<div id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.DIV_SUFFIXE+"\" onclick=\"SweetDevRia.$('${tree.id}').onClickNode (event);\"  class=\"ideo-tre-node {if isOpen == true} ideo-tre-expandNode{else} ideo-tre-collapseNode{/if}{if nodeType.cssClass}${nodeType.cssClass}{/if}{if styleClass}${styleClass}{/if}\" style=\"height:${tree.nodeHeight}px; {if displayNode == false} display:none;{else}{if style} ${style}{/if}{/if}\">\
		{if level > 0}\
		    {var arr = getIndentationArray();}\
			{for indent in arr}\
				<img id=\"${tree.id}_${id}_${indent_index}\" class=\"ideo-tre-images {if indent == true} ideo-tre-iconLine{/if}\" src=\"" + SweetDevRIAImagesPath + "/pix.gif\"/>\
			{/for}\
		{/if}\
		<img id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.LASTINDENT_SUFFIXE+"\" class=\"ideo-tre-images ${getLastIndentationClass()}\" src=\"" + SweetDevRIAImagesPath + "/pix.gif\"/>\
		<img id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.ICON_SUFFIXE+"\" class=\"ideo-tre-images  ${nodeType.iconClass}\" {if iconStyle}style=\"${iconStyle}\"{/if} src=\"" + SweetDevRIAImagesPath + "/pix.gif\"/>\
		{if nodeType.displayCheckbox}\
			<input id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.CHECK_SUFFIXE+"\" style=\"height:${tree.nodeHeight}px;display: inline-block;vertical-align: middle;\" name=\"${tree.id}\" value=\"${tree.id}_${id}\" type=\"checkbox\" {if checked}checked=\"checked\"{/if}/>\
		{/if}\
		<span style=\"display:inline;\" {if tooltip && tooltip!= null && tooltip != ''}title=\"${tooltip}\"{/if}>\
			<a id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.LABEL_A_SUFFIXE+"\" href=\"#\" style=\"vertical-align:middle;\" class=\"ideo-tre-nodeA\" onkeyup=\"SweetDevRia.$('${tree.id}').keyboardEvent(event); return false;\" onclick=\"return false;\">\
				<span id=\"${tree.id}_${id}"+SweetDevRia.TreeNode.LABEL_SUFFIXE+"\" style=\"height:${tree.nodeHeight}px;\" class=\"ideo-tre-label {if (tree.isTreeGrid)} ideo-tre-label-treeGrid{/if}\">${label}</span>\
			</a>\
		</span>\
	</div>\
";

SweetDevRia.TreeNode.prototype.templateChildren = "\
	{if isLeaf() == false}\
		<ul id=\"${tree.id}_${id}_children\" class=\"ideo-tre-children\" {if ((isOpen == false) || (children == null) || (children.length == 0))}style=\"display:none\"{/if}>\
			${getChildrenRender()}\
		</ul>\
		{if tree.displayRoot == false && isRoot}\
			<div id=\"${tree.id}_lastRootChild"+SweetDevRia.TreeNode.DIV_SUFFIXE+"\" class=\"ideo-tre-lastRootChild\" >&nbsp;</div>\
		{/if}\
	{/if}\
";

