/**------------------------------------
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
* This is the Tree component class 
* @param {String} id Id of this tree
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.Tree = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "Tree");

	this.root = null;
	
	this.nodes = {};
	
	this.nodeTypes = {};
	this.nodeTypeGroups = [];

	this.nodeHeight = SweetDevRia.Tree.DEFAULT_NODE_HEIGHT;
	
	this.newSelectNode = null;
	this.selectNode = null;
	this.copiedNodeData = null;
	this.cutNodeData = null;
	
	this.displayRoot = true;
	
	this.canAdd = false;
	this.canDelete = false;
	this.canModify = false;
	
	this.loading = false;
	this.loadingNode = null;
};

extendsClass(SweetDevRia.Tree, SweetDevRia.RiaComponent);

/**
* Suffixe for the drag and drop ids, related to each nodes
* @type String
*/
SweetDevRia.Tree.DRAG_PREFIXE = "_drag";

/**
 * Default node height
 */
SweetDevRia.Tree.DEFAULT_NODE_HEIGHT = 20;

/* Public APIS */
/**
 * This method is called when a node is selected
 * To be overridden !!
 * @param {TreeNode} The selected node.
 */
SweetDevRia.Tree.prototype.onSelect  = function(node){  /* override this */};



/**
 * Initialization on page load
 * @private
 */
SweetDevRia.Tree.prototype.initialize = function () {
	this.generateMenu();
	if (this.root) {
		this.root.initDD(true);
	}
	if(this.newSelectNode){
		this.newSelectNode.select(false);
		this.newSelectNode = null;
	}

	if(!this.displayRoot){
		var lastRootChild = SweetDevRia.DomHelper.get (this.id+"_lastRootChild"+SweetDevRia.TreeNode.DIV_SUFFIXE);
		if (lastRootChild) {
			this.addNodeDD("lastRootChild");
		}
	}

	return true;
};


/* Public APIS */

/**
 * This method is called before loading a node from the server
 * To be overridden !!
 * @param {TreeNode} node the node to load 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeLoadNode  = function(node){  /* override this */ return true;  };

/**
 * This method is called after having called a server request for a node.
 * @param {TreeNode} node the node to load 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterLoadNode = function(node){  /* override this */ };


/**
 * This method is called before processing a node load response
 * To be overridden !!
 * @param {TreeNode} node the node to load 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeOnLoadNode  = function(node){  /* override this */ return true;  };

/**
 * This method is called after having processed a node load response
 * @param {TreeNode} node the node to load 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterOnLoadNode = function(node){  /* override this */ };


/**
 * This method is called before copying a node
 * To be overridden !!
 * @param {TreeNode} node the node to copy 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeCopyNode  = function(node){  /* override this */ return true;  };

/**
 * This method is called after copying a node.
 * @param {TreeNode} node the node to copy 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterCopyNode = function(node){  /* override this */ };


/**
 * This method is called before cutting a node
 * To be overridden !!
 * @param {TreeNode} node the node to cut 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeCutNode  = function(node){  /* override this */ return true;  };

/**
 * This method is called after cutting a node.
 * @param {TreeNode} node the node to cut 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterCutNode = function(node){  /* override this */ };

/**
 * This method is called before pasting a node
 * To be overridden !!
 * @param {TreeNode} parentNode the node where the paste is performed
 * @param {int} position the position where the node must be pasted in this parent
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforePasteNode  = function(parentNode, position){  /* override this */ return true;  };

/**
 * This method is called after pasting a node.
 * @param {TreeNode} parentNode the node where the paste is performed
 * @param {int} position the position where the node must be pasted in this parent
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterPasteNode = function(parentNode, position){  /* override this */ };

/**
 * This method is called before deleting a node
 * To be overridden !!
 * @param {String} nodeId the node id to delete
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeDeleteNode  = function(nodeId){  /* override this */ return true;  };

/**
 * This method is called after deleting a node.
 * @param {String} nodeId the node id to delete
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterDeleteNode = function(nodeId){  /* override this */ };

/**
 * This method is called before adding a node
 * To be overridden !!
 * @param {TreeNode} parentNode the node which will receive the new one
 * @param {String} newLabel the new node label
 * @param {String} nodeType the new node type 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeAddNode  = function(parentNode,newLabel,nodeType){  /* override this */ return true;  };

/**
 * This method is called after adding a node.
 * @param {TreeNode} parentNode the node which will receive the new one
 * @param {String} newLabel the new node label
 * @param {String} nodeType the new node type 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterAddNode = function(parentNode,newLabel,nodeType){  /* override this */ };

/**
 * This method is called before editing a node
 * To be overridden !!
 * @param {TreeNode} node the edited node
 * @param {String} newLabel the new node label
 * @param {String} nodeType the new node type 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Tree.prototype.beforeModifyNode  = function(node,newLabel,newNodeType){  /* override this */ return true;  };

/**
 * This method is called after editing a node.
 * @param {TreeNode} node the edited node
 * @param {String} newLabel the new node label
 * @param {String} nodeType the new node type 
 * To be overridden !!
 */
SweetDevRia.Tree.prototype.afterModifyNode = function(node,newLabel,newNodeType){  /* override this */ };

/**
 * This event type is fired when load a node
 * @static
 */
SweetDevRia.Tree.LOAD_EVENT = "load";


/**
 * This event type is fired when copy a node
 * @static
 */
SweetDevRia.Tree.COPY_EVENT = "copy";

/**
 * This event type is fired when cut a node
 * @static
 */
SweetDevRia.Tree.CUT_EVENT = "cut";

/**
 * This event type is fired when paste a node
 * @static
 */
SweetDevRia.Tree.PASTE_EVENT = "paste";

/**
 * This event type is fired when delete a node
 * @static
 */
SweetDevRia.Tree.DELETE_EVENT = "delete";

/**
 * This event type is fired when add a node
 * @static
 */
SweetDevRia.Tree.ADD_EVENT = "add";

/**
 * This event type is fired when modify a node
 * @static
 */
SweetDevRia.Tree.MODIFY_EVENT = "modify";


/*********************** Ajax calls ***************************/

/**
 * Updates the server model.
 */
SweetDevRia.Tree.prototype.updateServerModel = function () {
	var params = {};
	
	SweetDevRia.ComHelper.fireEvent();
};

/** 
* Load the content of a node
* @param {TreeNode} node the node to load 
*/
SweetDevRia.Tree.prototype.loadNode = function (node){
	if (! node.isLeaf() && node.children == null && !node.loading) {
		if(this.beforeLoadNode(node)){
			
			this.loading = true;
			this.loadingNode = node;
			node.loading = true;
			node.updateIconRender();
			var evt = new SweetDevRia.RiaEvent ("loadNode", this.id, {"nodeId" : node.id});
			SweetDevRia.ComHelper.fireEvent (evt, false);
	
			YAHOO.util.DragDropMgr.locationCache = {};
		
			this.afterLoadNode(node);
		}
	}
};

/** 
* Callback method of the node loading
* @param {RiaEvent} evt the RiaEvent containing the data to load
* @private
*/
SweetDevRia.Tree.prototype.onLoadNode = function(evt){
	var node = this.nodes [evt.nodeId];

	if(this.beforeOnLoadNode(node)){
		if (node) {
			this.parseTreeNodeChildren (evt.children, node);
	
			if (this.isTreeGrid){
				node.expand ();		
				var grid = SweetDevRia.$(this.gridId);
				grid.renderNode = null;
				grid.setData (evt.data);
				/* SWTRIA-1124 */
				grid.updateColumnsSize();
			}
			else {
				node.drawChildren (true);
				node.expand ();		
			}
		
		}
		this.loading = false;
		this.loadingNode = null;
		node.loading = false;
		node.updateIconRender();
	
		this.fireEventListener (SweetDevRia.Tree.LOAD_EVENT, node);
	
		this.afterOnLoadNode(node);
	}
};

/*********************** Initializations and business method ***************************/

/** 
* Adds a node type for this tree
* @param {Object} nodeType the nodeType to add. This object must be the reflection of the Java one (NodeTypeBean).
*/
SweetDevRia.Tree.prototype.addNodeType = function (nodeType) {
	this.nodeTypes[nodeType.id] = nodeType;
	if(nodeType.groupId){
		var groupId = nodeType.groupId; 
		if(!this.nodeTypeGroups[groupId]){
			this.nodeTypeGroups[groupId] = [];
		}
		this.nodeTypeGroups[groupId].push(nodeType);
	}
};

/** 
* Get a node type according to its id
* @param {String} nodeTypeId The id of the node type to get
* @return the node type defined by this id
* @type Object
*/
SweetDevRia.Tree.prototype.getNodeType = function (nodeTypeId) {
	return this.nodeTypes [nodeTypeId];
};

/** 
* Get a node registered in this tree, according to its id
* @param {String} nodeId The id of the node to get
* @return the node defined by this id
* @type TreeNode
*/
SweetDevRia.Tree.prototype.getNode = function (nodeId) {
	return this.nodes [nodeId];
};

/** 
* Register a node in this tree
* Each node is registered only once
* @param {TreeNode} node The node to register
* @private
*/
SweetDevRia.Tree.prototype.register = function (node) {
	if (this.nodes [node.id] == null) {
		this.nodes [node.id] = node;
	}
};

/** 
* Unregister a node in this tree
* All its child nodes are unregistered as well
* @param {TreeNode} node The node to register
* @private
*/
SweetDevRia.Tree.prototype.unregister = function (node) {
	this.nodes [node.id] = null;
	
	if (! node.isLeaf() && node.children) {
		for (var i = 0; i < node.children.length; i++) {
			var child = node.children [i];
			this.unregister (child);
		}
	}	
};

/** 
* Adds the Drag and Drop feature to a node
* @param {String} nodeId The id to add a drag and drop on
* @private
*/
SweetDevRia.Tree.prototype.addNodeDD = function (nodeId) {
	var node = this.getNode(nodeId);
	if (node == null && nodeId != "lastRootChild") {
		return;
	}

	var nodeDD = new SweetDevRia.DD (this.id+"_"+nodeId+SweetDevRia.Tree.DRAG_PREFIXE);
	nodeDD.setDragId (this.id+"_"+nodeId+"_div");
	nodeDD.setFakeMode (SweetDevRia.DD.CLONE);
	nodeDD.group = this.id+"_dd";
	nodeDD.delta = true;
	nodeDD.displayIcon = true;
	
	nodeDD.hoverTimer = null;

	if (node) {
		var nodeNodeType = node.getNodeType();
		nodeDD.canDrag = (nodeNodeType.draggable && !this.getNode(nodeId).isRoot);
		//nodeDD.canDrop = nodeNodeType.droppable;
	}
	
	var tree = this;	
	// TODO a revoir, c po encore top mais c  l idee
	nodeDD.getDropEnterIconClass = function(dragObject, position){
		var el = this.getEl();
		var height = SweetDevRia.DomHelper.getHeight (el);

		var node = tree.getNode (nodeId);
		var dragNodeId = dragObject.id.substring (0, dragObject.id.length - SweetDevRia.Tree.DRAG_PREFIXE.length).substring (tree.id.length+1);
		
		var dragNode = tree.getNode (dragNodeId); // drag node

		if (node) {
			if(dragNode.isParent(node)){// cant drop
				return this.getDropOutIconClass();
			}

			if (! node.isLeaf()) {
				// Si je suis sur un folder, j ajoute en dernier fils
				if (position[1] > height/3) {
					return "ideo-tre-dropOnFolder";
				}
				else  {
					if (node.parentNode && node.id == node.parentNode.children[0].id) {
						return "ideo-tre-dropAtFirst";
					}
					else {
						return "ideo-tre-dropBetween";
					}				
				}
			}
			else {
				if (position[1] < height/2) {
					// Si on lache avant ce node
					if (node.parentNode && node.id == node.parentNode.children[0].id) {
						// Si c est le premier fils de son pere
						return "ideo-tre-dropAtFirst";
					}
					else {
						return "ideo-tre-dropBetween";
					}
				}
				else {
					// Si on lache apres ce node
					if (node.parentNode && node.id == node.parentNode.children[node.parentNode.children.length-1].id) {
						// Si c ets le dernier fils de son pere
						return "ideo-tre-dropAtLast";
					}
					else {
						return "ideo-tre-dropBetween";
					}
				}
			}
		}
		else if (! tree.displayRoot && nodeId == "lastRootChild") {
			return "ideo-tre-dropAtLast";
		}
	};

	nodeDD.onStartDrag = function ()	{
		var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);

		cloneContainer.style.width = null;
		cloneContainer.style.paddingRight = "5px";
		cloneContainer.style.whiteSpace = "nowrap"; // SWTRIA-912
	};

	nodeDD.onDropEnter = function (dragZone)	{
	
		var node = tree.getNode (nodeId);
		// gere l ouverture automatique d'un dossier fermer apres une seconde en over
		if (tree.hoverTimer != null && tree.hoverId != nodeId) {
			window.clearTimeout(tree.hoverTimer);
			tree.hoverId = null;
		}

		if (node && ! node.isLeaf() && ! node.isOpen && node.getNodeType().droppable) {
			tree.hoverTimer = window.setTimeout("SweetDevRia.$('"+tree.id+"').getNode('"+nodeId+"').expand();YAHOO.util.DragDropMgr.locationCache = {};", 1500);
			tree.hoverId = nodeId;
		}
	
	};

	nodeDD.onDrop = function(dragObject, position){
		var el = this.getEl();
		var height = SweetDevRia.DomHelper.getHeight (el);

		var dragNodeId = dragObject.id.substring (tree.id.length+1, dragObject.id.length - SweetDevRia.Tree.DRAG_PREFIXE.length);
		var dragNode = tree.getNode (dragNodeId); // drag node
		var node = tree.getNode (nodeId); // drop node

		var processDrop = !dragNode.isParent(node); //drag only if not a parent into a child 

		if(processDrop){
			tree.cutNode (dragNode); 

			if (node) {
				var pos = 0;
				if(!node.isRoot){
					pos = SweetDevRia.DomHelper.getTreePos (node.parentNode, node.id); 
				} 
				if (! node.isLeaf()) {
					// Si je suis sur un folder, j ajoute en dernier fils
					if (position[1] > height/3) {
						if(node.getChildren() == null){//lazy load required
							node.expand(); 
						}
						tree.pasteNode (node);
						node.expand();
					}
					else  {
						if (node.parentNode && node.id == node.parentNode.children[0].id) {
							tree.pasteNode (node.parentNode, 0); // add at first
						}
						else {
							tree.pasteNode (node.parentNode, pos); 	// add before node
						}				
					}
				}
				else {
					if (position[1] < height/2) {
						// Si on lache avant ce node
						if (node.parentNode && node.id == node.parentNode.children[0].id) {
							// Si c est le premier fils de son pere
							tree.pasteNode (node.parentNode, 0); 
						}
						else {
							tree.pasteNode (node.parentNode, pos); // add before node
						}
					}
					else {
						// Si on lache apres ce node
						if (node.parentNode && node.id == node.parentNode.children[node.parentNode.children.length-1].id) {
							// Si c ets le dernier fils de son pere
							tree.pasteNode (node.parentNode);
						}
						else {
							tree.pasteNode (node.parentNode, pos+1); // add after node
						}
					}
				}
			}
			else if (! tree.displayRoot && nodeId == "lastRootChild") {
				tree.pasteNode (tree.root); 
			}
			
			if (dragNodeId) { // SWTRIA-913
				// Remove ideo-tre-cutNode style here to be sure it will removed even if drag&drop fail.
				SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(tree.id+"_"+dragNodeId+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-cutNode");
			}
			
			
		}
	
		if (node) {
			var labelComp = SweetDevRia.DomHelper.get (tree.id+"_"+node.id+SweetDevRia.TreeNode.LABEL_SUFFIXE);
			if (labelComp) {
				SweetDevRia.DomHelper.removeClassName (labelComp, "ideo-tre-dragOver");
			}
		}
	
		SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragAbove");
		SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragBelow");
		
		if(tree.hoverTimer){
			window.clearTimeout(tree.hoverTimer);
			tree.hoverTimer = null;
			tree.hoverId = null;
		}
		
		YAHOO.util.DragDropMgr.locationCache = {};
	};

	nodeDD.onDropOver = function (dragObject, position)	{
		var el = this.getEl();
		var height = SweetDevRia.DomHelper.getHeight (el);

		var node = tree.getNode (nodeId);

		if( node) {
			if( node.isLeaf()) {
				if (position[1] < height/2) {
					SweetDevRia.DomHelper.addClassName (el, "ideo-tre-dragAbove");
					SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragBelow");
				}
				else {
					SweetDevRia.DomHelper.addClassName (el, "ideo-tre-dragBelow");
					SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragAbove");
				}
			}
			else {
				if (position[1] < height/3) {
					SweetDevRia.DomHelper.addClassName (el, "ideo-tre-dragAbove");
					SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragBelow");
	
					var labelComp = SweetDevRia.DomHelper.get (tree.id+"_"+node.id+SweetDevRia.TreeNode.LABEL_SUFFIXE);
					if (labelComp) {
						SweetDevRia.DomHelper.removeClassName (labelComp, "ideo-tre-dragOver");
					}
				}
				else {
					var labelComp = SweetDevRia.DomHelper.get (tree.id+"_"+node.id+SweetDevRia.TreeNode.LABEL_SUFFIXE);
					if (labelComp) {
						SweetDevRia.DomHelper.addClassName (labelComp, "ideo-tre-dragOver");
					}
					SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragAbove");
					SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragBelow");
				}
			}
		}
		else if (! tree.displayRoot && nodeId == "lastRootChild") {
			// TODO mettre le trait ss le dernier noeud
			null;//JSLint null
		}
	};

	nodeDD.onDropOut = function (dragObject)	{
		var el = this.getEl();

		var node = tree.getNode (nodeId);

		SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragAbove");
		SweetDevRia.DomHelper.removeClassName (el, "ideo-tre-dragBelow");

		if( node) {
			if( ! node.isLeaf()) {
				var labelComp = SweetDevRia.DomHelper.get (tree.id+"_"+node.id+SweetDevRia.TreeNode.LABEL_SUFFIXE);
				if (labelComp) {
					SweetDevRia.DomHelper.removeClassName (labelComp, "ideo-tre-dragOver");
				}
			}
		}
	};

	nodeDD.createClone = function(node){
		var clone = node.cloneNode (true);
	 	clone.className = "";
		SweetDevRia.DomHelper.addClassName(clone, "ideo-dd-clone");

		var nodeId = node.id.substring (tree.id.length+1, node.id.length - SweetDevRia.TreeNode.DIV_SUFFIXE.length);

		for (var i = 0 ; i < 50; i++) {
			if (!SweetDevRia.DomHelper.removeChild (clone, tree.id+"_"+nodeId+"_"+i)) {
				break;
			}
		}
		
		var lastIndent = SweetDevRia.DomHelper.get (tree.id+"_"+nodeId+ SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
		if (lastIndent) {
			SweetDevRia.DomHelper.removeChild (clone, tree.id+"_"+nodeId+SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
		}

		var check = SweetDevRia.DomHelper.get (tree.id+"_"+nodeId+ SweetDevRia.TreeNode.CHECK_SUFFIXE);
		if (check) {
			SweetDevRia.DomHelper.removeChild (clone, tree.id+"_"+nodeId+SweetDevRia.TreeNode.CHECK_SUFFIXE);
		}
		
		this.cleanAllIds (clone);
		
		return clone;
	};

};


SweetDevRia.Tree.prototype.selectTreeGridRow = function (evt, node) {
	if (this.isTreeGrid) {
		// We select the grid row
		var grid = SweetDevRia.$ (this.gridId);
		if (grid) {
			var column = grid.getFirstColumn ();
			grid.onSelectCellEvt (evt, node.id, column.id);
		}
	}
};

/** 
* Event triggered on a node click 
* @param {HTMLEvent} evt The event related to the click
* @private
*/
SweetDevRia.Tree.prototype.onClickNode = function (evt) {
//	var menu = SweetDevRia.$ (this.id + "Menu");
//	if (menu) {
//		menu.hide ();	
//	}
	
	evt = SweetDevRia.EventHelper.getEvent (evt);

	var tree = this;

	function getNode (srcId, token){
		if (srcId.indexOf (token) == srcId.length - token.length) {
			var nodeId = srcId.substring (tree.id.length+1, srcId.length - token.length);
			return tree.nodes [nodeId];
		}
		
		return null;
	}


	var srcId = evt.src.id;

	var node = getNode (srcId, SweetDevRia.TreeNode.LASTINDENT_SUFFIXE);
	if (node == null) {
		node = getNode (srcId, SweetDevRia.TreeNode.ICON_SUFFIXE);
		if (node == null) {
			node = getNode (srcId, SweetDevRia.TreeNode.LABEL_SUFFIXE);
			if (node != null) {
				node.expand ();//factorisation obligatoire : evite un bug de synchro si le label action est une redirection
				node.select (true);
		
				node.labelAction ();

				this.selectTreeGridRow (evt, node);
			}
			else {
				node = getNode (srcId, SweetDevRia.TreeNode.CHECK_SUFFIXE);
				if (node != null) {
					node.expand ();
					node.select (true);

					node.swapCheck ();
		
					this.selectTreeGridRow (evt, node);

					node = null;
				}
				else {
					node = getNode (srcId, SweetDevRia.TreeNode.DIV_SUFFIXE);
					if (node) {
						node.expand ();
						node.select (true);
		
						this.selectTreeGridRow (evt, node);
					}
				}
			}
		}
		else  {
			node.expand ();
			node.select (true);

			node.iconAction ();
		
			this.selectTreeGridRow (evt, node);
		}
	}
	else {
		node.swapCollapse ();
	}

	//this event do not return false or the check would be disabled, we have to stop the propagation.
	SweetDevRia.EventHelper.stopPropagation(evt);
	
//	SweetDevRia.EventHelper.preventDefault(evt);
};

SweetDevRia.Tree.prototype.keyboardEvent = function(evt) {
	var type = SweetDevRia.KeyListener.getEventType(evt);

	if (type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
		var keyCode = evt.keyCode;
		var selection = null;
	
		switch(keyCode) {
			case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
				if (this.selectNode) {
					this.selectNode.collapse();
				}
				break;
			case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
				if (this.selectNode) {
					this.selectNode.expand();
				}
				break;
			case SweetDevRia.KeyListener.ARROW_UP_KEY:
				if (this.selectNode) {
					var previousNode = this.selectNode.getPreviousNode ();
					if (previousNode && !(previousNode.isRoot && !this.displayRoot)) {
						previousNode.select(true);
					}
				}
				break;
			case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
				var nextNode = this.selectNode.getNextNode ();
				if (nextNode) {
					nextNode.select(true);
				}
				break;
			case SweetDevRia.KeyListener.STAR_KEY_SHIFT:
				if(!evt.shiftKey){
					break;
				}
			case SweetDevRia.KeyListener.STAR_KEY:
				if (this.selectNode) {
					this.selectNode.expandAll();
				}
				break;
			case SweetDevRia.KeyListener.F2_KEY:
				if(this.canModify){
					SweetDevRia.$(this.id + "Menu").clickedItem = this.selectNode.id;
					this.modifyNodeAction();
				}
				break;
			default:
				break;
		}
	}
	else if (type == SweetDevRia.RiaEvent.COPY_TYPE && this.canAdd) {
		this.copyNode (this.selectNode);
	}
	else if (type == SweetDevRia.RiaEvent.CUT_TYPE && this.canDelete) {
		this.cutNode (this.selectNode);
	}
	else if (type == SweetDevRia.RiaEvent.PASTE_TYPE && this.canAdd) {
		this.pasteNode (this.selectNode);
	}
};

/** 
* Set the root of this tree, before initialization and rendering 
* @param {TreeNode} root The root node.
* @private
*/
SweetDevRia.Tree.prototype.setRoot = function (root) {
	this.root = root;
	this.register (root);
	this.root.initTree( this );
};

/** 
* Parses a tree node as they are sent by the server 
* @param {Array} nodeData The data of the node as they are formatted by the server
* @param {TreeNode} parentNode The parent node of this node to parse
* @param {int} position the position of this node in its parent
* @return the node parse
* @type TreeNode
* @private
*/
SweetDevRia.Tree.prototype.parseTreeNode = function (nodeData, parentNode, position) {

	if (nodeData && nodeData.reverse && nodeData.length > 1) {//6 avoid the toJSONString function to be parsed
		var nodeId = nodeData [0];
		var nodeLabel = nodeData [1];
		var nodeType = nodeData [2];
		var expanded = nodeData [3];
		var information = nodeData [4];
		var iconStyle = nodeData [5];
		var style = nodeData [6];
		var styleClass = nodeData [7];
		var selected = nodeData [8];
		var checked = nodeData [9];
		var childrenData = nodeData [10];

		var node = new SweetDevRia.TreeNode (nodeId, nodeLabel, parentNode, this.getNodeType(nodeType), position);
		node.isOpen = expanded;
		node.information = information;
		node.iconStyle = iconStyle;
		node.style = style;
		node.styleClass = styleClass; 
		node.selected = selected;
		node.checked = checked;
		if(node.selected){
			this.newSelectNode = node;
		}

		this.parseTreeNodeChildren (childrenData, node);
		
		return node;
	}

	return null;
};

/** 
* Parses the children of a node 
* @param {Array} childrenData The data of the node's children
* @param {TreeNode} parentNode The node for which the children will be parsed
* @private
*/
SweetDevRia.Tree.prototype.parseTreeNodeChildren = function (childrenData, parentNode) {
	if (childrenData) {
		if(!parentNode.children){
			parentNode.children = [];
		}

		
		for (var i = 0; i < childrenData.length; i ++) {
			var childData = childrenData [i];
			var child = this.parseTreeNode (childData, parentNode);
		}
	}
};

/** 
* Set the root data in this tree, as they are sent by the server
* This method parses the data, creates the TreeNodes objects and set them into the tree 
* @param {Array} rootData The root data as sent by the server
* @private
*/
SweetDevRia.Tree.prototype.setRootData = function (rootData) {
	var rootNode = this.parseTreeNode (rootData);
	if (rootNode) {
		this.setRoot (rootNode);
	}
};


/** 
* Action triggered on a node copy.
* This function bufferize the node being copied.
* @param {TreeNode} node the node to copy
* @private
*/
SweetDevRia.Tree.prototype.copyNode = function (node) {
	if(!node.nodeType.draggable){
		return;
	}

	if(this.beforeCopyNode(node)){
		if(this.copiedNodeData){
			SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.copiedNodeId+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-copiedNode");
		}
		if(this.cutNodeData){
			SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.cutNodeData[0]+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-cutNode");
		}
		this.copiedNodeData = this.getNodeData (node, true, true);
		this.copiedNodeId = node.id;
		
		SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.copiedNodeId+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-copiedNode");
			
		this.cutNodeData = null;
	
		this.fireEventListener (SweetDevRia.Tree.COPY_EVENT, node);

		this.afterCopyNode(node);
	}
};

/** 
* Action triggered on a node cut.
* This function bufferize the node being cut.
* @param {TreeNode} node the node to cut
* @private
*/
SweetDevRia.Tree.prototype.cutNode = function (node) {
	if(!node.nodeType.draggable){
		return;
	}

	if(this.beforeCutNode(node)){
		if(this.cutNodeData){
			SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.cutNodeData[0]+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-cutNode");
		}
		if(this.copiedNodeData){
			SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.copiedNodeId+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-copiedNode");
		}
	
		this.cutNodeData = this.getNodeData (node, false, true);
		
		SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_"+node.id+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-cutNode");
		
		this.copiedNodeData = null;
	
		this.fireEventListener (SweetDevRia.Tree.CUT_EVENT, node);

		this.afterCutNode(node);
	}
};

/** 
* This function paste a node at a specific position. Called on copy, cut, and drag and drop
* @param {TreeNode} parentNode the node where the paste is performed
* @param {int} position the position where the node must be pasted in this parent
* @private
*/
SweetDevRia.Tree.prototype.pasteNode = function (parentNode, position) {

	if(!parentNode){
		return;
	}
	
	if(!parentNode.nodeType.droppable){
		return ;
	}
		
	if(this.beforePasteNode(parentNode, position)){

		if(parentNode.isLeaf()){
			parentNode = parentNode.parentNode;
		}
		if (parentNode && ! parentNode.isLeaf()) {
			parentNode.expand ();

			if (this.copiedNodeData) {
				var copiedId = this.copiedNodeData[0];
				var copiedNode = this.getNode (copiedId);
				
				// Do not  paste a node into one its children
				if (copiedNode != null && copiedNode.isParent(parentNode)) {			
					return;
				}

				this.parseTreeNode (this.copiedNodeData, parentNode, position);
				SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_"+this.copiedNodeId+SweetDevRia.TreeNode.DIV_SUFFIXE), "ideo-tre-copiedNode");
				var params = {"nodeId":this.copiedNodeId, "nodePasteAppendice":this.getAppendice(this.copiedNodeId), "nodeParentId":parentNode.id, "position":position};
				var riaEvent = new SweetDevRia.RiaEvent ("copyPaste", this.id, params);
				
				SweetDevRia.ComHelper.stackEvent(riaEvent);
				
//				parentNode.refresh(); // srevel :: avec cette ligne a la place du drawchildren, qd on dd un noeud, on ne peut plus dragdropper les autres fils du pere du noeud droppe
				parentNode.drawChildren (true);
			}
			else if (this.cutNodeData) {
				var cuttedId = this.cutNodeData[0];
				var cuttedNode = this.getNode (cuttedId);
	
				// Do not  paste a node into one its children
				if (cuttedNode.isParent(parentNode)) {
					return;
				}				
	
				// If we paste the cutted node in the same parent, we must decrease the position 
				if (parentNode == cuttedNode.parentNode) {
					var pos = SweetDevRia.DomHelper.getTreePos (parentNode, cuttedId); 
					if (position > pos) {
						position --;
					}
				}
	
				this.deleteNode (cuttedId);
	
				this.parseTreeNode (this.cutNodeData, parentNode, position);
	
				var params = {"nodeId":this.cutNodeData [0], "nodeParentId":parentNode.id, "position":position};
				var riaEvent = new SweetDevRia.RiaEvent ("cutPaste", this.id, params);
				
				SweetDevRia.ComHelper.stackEvent(riaEvent);

//				parentNode.refresh();// srevel :: avec cette ligne a la place du drawchildren, qd on dd un noeud, on ne peut plus dragdropper les aautres fils du pere du noeud droppe
				parentNode.drawChildren (true);
			}
			parentNode.refreshLastIndentationClass();
			
			parentNode.isOpen = false;
			parentNode.expand ();
			
		}
		
		this.cutNodeData = null;
		this.copiedNodeData = null;
	
		this.fireEventListener (SweetDevRia.Tree.PASTE_EVENT, [parentNode, position]);

		this.afterPasteNode(parentNode, position);	
	}
};

/** 
* Delete a specific node, removing its visual and JavaScript instances.
* @param {String} nodeId the node id to delete
* @private
*/
SweetDevRia.Tree.prototype.deleteNode = function (nodeId) {
	if(this.beforeDeleteNode(nodeId)){
	
		var node = this.nodes [nodeId];
	
		if (node && ! node.isRoot) {
			// Delete child if it has
			this.deleteChildNodes(nodeId);
	
			//we store the eventuals nodes to refresh
			var previousNode = node.getPreviousNode();
			var nextNode = node.getNextNode();
			var isLastTreeNode = node.isLastTreeNode();
			
			this.unregister (node);		
			
			// update parent node children tab
			var parentNode = node.parentNode;
			if (parentNode) {
				parentNode.children.remove (node);
			}
			
			// delete physical node
			var li = document.getElementById (this.id+"_"+node.id+"_li");
			if (li) {
				SweetDevRia.DomHelper.removeNode (li);
			}
			
			if (! parentNode.hasChildren ()) {
				parentNode.refreshLastIndentationClass ();

				var ul = document.getElementById (this.id+"_"+parentNode.id+"_children");
				ul.style.display = "none";
			}
			
			if(previousNode){
				previousNode.refreshLastIndentationClass();
			}
	
			if(nextNode){
				nextNode.refreshLastIndentationClass();
			}
			
			if(isLastTreeNode && parentNode){
				//refresh parent class
				parentNode.refreshIndentationImages(true);
			}
		}
		
		this.fireEventListener (SweetDevRia.Tree.DELETE_EVENT, nodeId);

		this.afterDeleteNode(nodeId);
	}
};

/** 
* Delete the whole child nodes of a node
* @param {String} nodeId the node id to remove the children
* @private
*/
SweetDevRia.Tree.prototype.deleteChildNodes = function (nodeId) {
	var node = this.nodes [nodeId];
	if (node && node.hasChildren () && (node.children != null)) {
		while( node.children.length > 0 ) {
			var child = node.children [0];
			this.deleteNode (child.id);
		}
		node.refreshLastIndentationClass ();
	}
};


/** 
* Return the text to append to this node id, 
* ensuring the unicity of the node generated by appending this returned string to the nodeSrcId.
* @param {String} nodeSrcId the node to append the appendice.
* @return the appendice created
* @type String
*/ 
SweetDevRia.Tree.prototype.getAppendice = function(nodeSrcId){
	var cpt=0;
	var str = nodeSrcId+"_"+cpt;
	while(this.getNode(str)){
		cpt++;
		str = nodeSrcId+"_"+cpt;
	} 
	return "_"+cpt;
};

/** 
* Return a copy id for the node given in parameter.
* The generated is equivalent to "%nodeSrcId%_%nextCount%", nextCount the next number copied.
* @param {String} nodeSrcId the node to append the appendice.
* @return the new node id created, related to the parameter one
* @type String
*/
SweetDevRia.Tree.prototype.generateCopiedNodeId = function(nodeSrcId){
	return nodeSrcId + this.getAppendice(nodeSrcId);
};

/** 
* Generates a new id for a node to create and add into the parentNodeId in parameter
* The generated id is equivalent to "NewNode_%nextCount%", nextCount the next number created.
* @param {String} parentNodeId the parent node to create the new one. Not used by default.
* @return the new node id created
* @type String
*/
SweetDevRia.Tree.prototype.generateNewNodeId = function(parentNodeId){
	return this.generateCopiedNodeId("NewNode");
};



/****************** Menu Actions ***********************/

/** 
* Reinitializes and open the window showing the "Add Node" feature.
* @private
*/
SweetDevRia.Tree.prototype.addNodeAction = function () {
	if(this.canAdd){

		var menu = SweetDevRia.$ (this.id + "Menu");
		var parentNodeId = menu.clickedItem;
	
		var parentNode = this.nodes [parentNodeId];
		if (parentNode && ! parentNode.isLeaf()) {
			var win = SweetDevRia.$(this.id+"_addWin");
			if (win == null) {
				win = this.generateAddWindow ();
			}
		
			win.parentNode = parentNode;
	
			// reset form values
			SweetDevRia.Form.resetComponent (document.getElementById (this.id+"_addNodeId"));
			SweetDevRia.Form.resetComponent (document.getElementById (this.id+"_addType"));
	
			win.open ();
			win.centerOnScreen(); 
		}
		
	}else{
		SweetDevRia.log.warn("The node addition is not allowed.");
	}
};

/** 
* Action triggered on a node deletion
* @private
*/
SweetDevRia.Tree.prototype.deleteNodeAction = function () {
	if(this.canDelete){

		var menu = SweetDevRia.$ (this.id + "Menu");
		var nodeId = menu.clickedItem;
		if (this.nodes [nodeId] && this.nodes [nodeId].isRoot) {
			return;
		}
	
		this.deleteNode (nodeId);
		
		var params = {"nodeId":nodeId};
		var riaEvent = new SweetDevRia.RiaEvent ("delete", this.id, params);
			
		SweetDevRia.ComHelper.stackEvent(riaEvent);
		
	}else{
		SweetDevRia.log.warn("The node suppression is not allowed.");
	}
};

/** 
* Reinitializes and open the window showing the "Modify Node" feature.
* @private
*/
SweetDevRia.Tree.prototype.modifyNodeAction = function () {
	if(this.canModify){
	
		var menu = SweetDevRia.$ (this.id + "Menu");
		var parentNodeId = menu.clickedItem;
	
		var parentNode = this.nodes [parentNodeId];
		var win = SweetDevRia.$(this.id+"_modifyWin");
		if (win == null) {
			win = this.generateModifyWindow ();
		}
	
		win.parentNode = parentNode;
	
		var selectNode = document.getElementById(this.id+"_modifyType");
		selectNode.options.length = 0;
		selectNode.style.display = "none";
		document.getElementById(this.id+"_modifyTypeLabel").style.display = "none";
	
		var groupId = parentNode.getNodeType().groupId;
		if(groupId && this.nodeTypeGroups[groupId].length>1){
			selectNode.style.display = "";
			document.getElementById(this.id+"_modifyTypeLabel").style.display = "";
			for(var i=0; i<this.nodeTypeGroups[groupId].length ; ++i){
				selectNode.options[selectNode.options.length] = new Option (this.nodeTypeGroups[groupId][i].id, this.nodeTypeGroups[groupId][i].id);
			}
		}
		else {
			selectNode.options[selectNode.options.length] = new Option (parentNode.getNodeType().id, parentNode.getNodeType().id);
		}
		
		// reset form values
		SweetDevRia.Form.setValue (document.getElementById (this.id+"_modifyNodeId"), parentNode.label);
		SweetDevRia.Form.setValue (document.getElementById (this.id+"_modifyType"), parentNode.getNodeType().id);
	
		win.open ();
		win.centerOnScreen(); 
	
	}else{
		SweetDevRia.log.warn("The node modification is not allowed.");
	}
};

/** 
* Action triggered on an node creation request
* Closes the window as well.
* @private
*/
SweetDevRia.Tree.prototype.addNodeWindowAction = function (evt) {
	if(this.canAdd){

		var win = SweetDevRia.$(this.id+"_addWin");
		if (win && win.parentNode && ! win.parentNode.isLeaf() ) {
			var newLabel = SweetDevRia.Form.getValue (this.id+"_addNodeId");
			var nodeType = SweetDevRia.Form.getValue (this.id+"_addType");
			var parentNode = win.parentNode;
			
			if(this.beforeAddNode(parentNode,newLabel,nodeType)){
	
				if (parentNode.isOpen && parentNode.children.length == 0) {
					parentNode.isOpen = false;
				}
	
				//  add this node
				var nodeId = this.generateNewNodeId (parentNode.id);
				var data = 	[nodeId, newLabel, nodeType, null];

				parentNode.tree.parseTreeNode (data, parentNode);

				//parentNode.refresh(); // srevel :: avec cette ligne a la place du drawchildren, qd on dd un noeud, on ne peut plus dragdropper les aautres fils du pere du noeud droppe
				parentNode.drawChildren (true);
				parentNode.refreshLastIndentationClass();		
				
				parentNode.expand ();
				
				var params = {"nodeId":nodeId, "label": newLabel, "nodeTypeId":nodeType, "parentNodeId":parentNode.id};
				var riaEvent = new SweetDevRia.RiaEvent ("add", this.id, params);
				
				SweetDevRia.ComHelper.stackEvent(riaEvent);
				
				win.close ();
				
				this.fireEventListener (SweetDevRia.Tree.ADD_EVENT, [parentNode,newLabel,nodeType]);
	
				this.afterAddNode(parentNode,newLabel,nodeType);
			}
			
			SweetDevRia.EventHelper.stopPropagation(evt);
		}
	
	}else{
		SweetDevRia.log.warn("The node addition is not allowed.");
	}
};

/** 
* Action triggered on an node modification request
* Closes the window as well.
* @private
*/
SweetDevRia.Tree.prototype.modifyNodeWindowAction = function (evt) {
	if(this.canModify){

		var win = SweetDevRia.$(this.id+"_modifyWin");
		if (win && win.parentNode) {
			var parentNode = win.parentNode;
			
			var newLabel = SweetDevRia.Form.getValue (this.id+"_modifyNodeId");
			var newNodeType = SweetDevRia.Form.getValue (this.id+"_modifyType");
			
			if(this.beforeModifyNode(parentNode,newLabel,newNodeType)){
			
				//  Modify this node
				parentNode.modifyNode(newLabel,newNodeType);
				
				win.close ();
				
				this.fireEventListener (SweetDevRia.Tree.MODIFY_EVENT, [parentNode,newLabel,newNodeType]);

				this.afterModifyNode(parentNode,newLabel,newNodeType);
			}
			
			SweetDevRia.EventHelper.stopPropagation(evt);
		}
		
	}else{
		SweetDevRia.log.warn("The node modification is not allowed.");
	}
};

/** 
* Return the data related to a node and allowing a cloning.
* @param {TreeNode} node the node to gather the data from
* @param {boolean} createId if a new id must be generated for the data extracted
* @param {boolean} deep the recursiv ability of the data gather. If true, the children will be extracted as well. 
* @return the array representing the node data, as they are sent by the server on initialization
* @type Array
* @private
*/
SweetDevRia.Tree.prototype.getNodeData = function (node, createId, deep) {
	var data = [];

	var children = null;
	if (deep && node.children) {
		children = [];
		for (var i = 0; i < node.children.length; i++) {
			var child = node.children [i];
			
			var childData = this.getNodeData (child, createId, deep);
			children.add (childData);
		}
	}

	var nodeId = node.id;
	var label = node.label;
	if (createId) {
		nodeId = this.generateCopiedNodeId(node.id);
	}

	data = [nodeId, label, node.nodeType.id, node.isOpen, node.information, node.iconStyle, node.style, node.styleClass, (this.selectNode && (this.selectNode.id == node.id)), node.checked, children];//recreate the API creating the node
	return data;
};


/**
 * Refreshes the content of the node and its children by redrawing the content of its container
 * @param {boolean} reload If true, all children are clear and so reload from server.
 */
SweetDevRia.Tree.prototype.refresh = function(reload){
	if (! this.root) {
		return; 
	}
	this.root.refresh (reload);
};

/****************** SweetDevRia Elements generation ***********************/

/** 
* Generates and initializes the add window
* @private
*/
SweetDevRia.Tree.prototype.generateAddWindow = function () {
	
	var win = new SweetDevRia.Window(this.id+"_addWin", -1, -1, 300, 140);
	win.content = TrimPath.processDOMTemplate(this.templateAddWindow, this);

	win.title = this.getMessage('addNode');	
	win.modal = true;	
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.isResizable = false;
    win.isOpen = false;
    win.isLoaded = true;

	win.render ();
	SweetDevRia.init ();

	return win;
};

/** 
* Generates and initializes the modify window
* @private
*/
SweetDevRia.Tree.prototype.generateModifyWindow = function () {
	
	var win = new SweetDevRia.Window(this.id+"_modifyWin", -1, -1, 300, 140);
	win.content = TrimPath.processDOMTemplate(this.templateModifyWindow, this);

	win.title = this.getMessage('editNode');	
	win.modal = true;	
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.isResizable = false;
    win.isOpen = false;
    win.isLoaded = true;

	win.render ();
	SweetDevRia.init ();

	return win;
};

/**
 * Generate the list context menu that allow to the user to add, delete or modify items.
 * The generation is not performed if the 3 actions are forbidden.
 * @private
 */
SweetDevRia.Tree.prototype.generateMenu = function () {
	if(!this.canAdd && !this.canDelete && !this.canModify){
		return;
	}

	var menu = new SweetDevRia.ContextMenu (this.id + "Menu");
	menu.targetId = this.id+"_box";

	var tree = this;

	menu.beforeShow = function (e){
		e = SweetDevRia.EventHelper.getEvent (e);

		var src = e.src;
		while (! SweetDevRia.DomHelper.hasClassName(src, "ideo-tre-li") && src != document.body) {
			src = src.parentNode;
		}

		if (SweetDevRia.DomHelper.hasClassName(src, "ideo-tre-li")) {
			var srcId = src.id;
			var nodeId = srcId.substring (tree.id.length+1, srcId.length - ("_li".length));
			var node = tree.nodes[nodeId];
			if (node) {
				node.select (true);
			}
			
			menu.clickedItem = nodeId;
		}

		SweetDevRia.EventHelper.stopPropagation(e);

		return true;  
	};

	menu.afterShow = function (){
		var addItem = SweetDevRia.$ (tree.id + "menuAddNode");
		if (tree.selectNode) {
			if (tree.selectNode.isLeaf() || !tree.canAdd) {
				addItem.setDisabled (true);
			}else{
				addItem.setDisabled (false);
			}
		}

		var deleteItem = SweetDevRia.$ (tree.id + "menuDeleteNode");
		if (tree.selectNode) {
			if(tree.selectNode.isRoot || !tree.canDelete){
				deleteItem.setDisabled (true);
			}else{
				deleteItem.setDisabled (false);//not the root and can delete
			}
		}

	};
	
	
	var menuAddNode = new SweetDevRia.MenuItem(this.id + "menuAddNode");
	menuAddNode.label = this.getMessage('addNodeMenu');
	menuAddNode.checkbox = false;
	menuAddNode.checked = false;
	menuAddNode.disabled = !this.canAdd;
	menuAddNode.image = null ;
	menuAddNode.onclick = function(){tree.addNodeAction ();};
	menuAddNode.oncheck = function(){};
	menuAddNode.onuncheck = function(){};

	menu.addItem(menuAddNode);


	var menuModifyNode = new SweetDevRia.MenuItem(this.id + "menuModifyNode");
	menuModifyNode.label = this.getMessage('editNodeMenu');
	menuModifyNode.checkbox = false;
	menuModifyNode.checked = false;
	menuModifyNode.disabled = !this.canModify;
	menuModifyNode.image = null ;
	menuModifyNode.onclick = function(){tree.modifyNodeAction ();};
	menuModifyNode.oncheck = function(){};
	menuModifyNode.onuncheck = function(){};

	menu.addItem(menuModifyNode);

	var menuDeleteNode = new SweetDevRia.MenuItem(this.id + "menuDeleteNode");
	menuDeleteNode.label = this.getMessage('deleteNodeMenu');
	menuDeleteNode.checkbox = false;
	menuDeleteNode.checked = false;
	menuDeleteNode.disabled = !this.canDelete;
	menuDeleteNode.image = null ;
	menuDeleteNode.onclick = function(){tree.deleteNodeAction ();};
	menuDeleteNode.oncheck = function(){};
	menuDeleteNode.onuncheck = function(){};

	menu.addItem(menuDeleteNode);

	// create menu !
	menu.render ();

	SweetDevRia.init ();
};

SweetDevRia.Tree.prototype.templateAddWindow = 
"\
<div style=\"margin:5px\">\
${getMessage('labelLabel')} : <input id=\"${id}_addNodeId\" />\
<br/>\
${getMessage('typeLabel')} : <select id=\"${id}_addType\">\
{for nodeType in nodeTypes}\
<option value=\"${nodeType.id}\">${nodeType.id}</option>\
{/for}\
</select>\
<br/>\
<br/>\
<div style=\"text-align:center\">\
<button onclick=\"SweetDevRia.$('${id}').addNodeWindowAction (event);return false;\">${getMessage('addButton')}</button>\
<button onclick=\"SweetDevRia.$('${id}_addWin').close (); SweetDevRia.EventHelper.stopPropagation(event);return false;\">${getMessage('cancelButton')}</button>\
</div>\
</div>\
";

SweetDevRia.Tree.prototype.templateModifyWindow = 
"\
<div style=\"margin:5px\">\
${getMessage('labelLabel')} : <input id=\"${id}_modifyNodeId\" />\
<br/>\
<span id=\"${id}_modifyTypeLabel\">${getMessage('typeLabel')} :</span><select id=\"${id}_modifyType\">\
</select>\
<br/>\
<br/>\
<div style=\"text-align:center\">\
<button onclick=\"SweetDevRia.$('${id}').modifyNodeWindowAction (event); return false;\">${getMessage('editButton')}</button>\
<button onclick=\"SweetDevRia.$('${id}_modifyWin').close (); SweetDevRia.EventHelper.stopPropagation(event);return false;\">${getMessage('cancelButton')}</button>\
</div>\
</div>\
";

SweetDevRia.Tree.prototype.template = "\
<div id=\"${id}_box\" class=\"ideo-tre-box\">\
	<div id=\"${id}Menu_container\" style=\"display:none;\"></div>\
	<div id=\"${id}_addWin_container\" style=\"display:none;\"></div>\
	<div id=\"${id}_modifyWin_container\" style=\"display:none;\"></div>\
	${root.render()}\
</div>\
";