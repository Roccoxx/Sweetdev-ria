/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006 - 2010] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 * Ideo Technologies S.A
 * 124 rue de Verdun
 * 92800 Puteaux - France
 *
 * France & Europe Phone : +33 1.46.25.09.60
 * 
 *
 * web : http://www.ideotechnologies.com
 * email : Sweetdev_ria_sales@ideotechnologies.com
 *
 *
 * @version 3.5.2.1
 * @author Ideo Technologies
 */

/**
 * @param {String} id Id of this frame
 * @constructor
 */
SweetDevRia.FrameNude = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.FrameNude");
};

SweetDevRia.FrameNude.prototype.refreshBorders = function(){
};

SweetDevRia.FrameNude.prototype.isNude = function(){
	return true;
};

extendsClass(SweetDevRia.FrameNude, SweetDevRia.RiaComponent);

SweetDevRia.FrameNude.prototype.isVisible = function () {return false;};
