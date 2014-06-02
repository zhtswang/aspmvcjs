(function(window,$){
	var AspMvcJs = AspMvcJs ||{};
	AspMvcJs.version = "1.0";
	
	AspMvcJs.Util = (function(){
	return {
            log:function(msg){
                if(console.log){
                    console.log(msg);
                }else{
                    alert(msg);
                }
            },
	   format:function(str,params){
		var result = str.replace("\{\\d+\}",function(match){
			var index = match.replace('\{|\}','');
			if(index+1>params.length){
				return params[index];
			}
		});
	        return result;
   	  }
        }
	})();
	
        var Const = {
            controllerSuffix: "Controller"
        };
  
	/* The MvcHandler is the core function of the framework, it will dispath all the request
	PathMap E.g: {url:'user/get/202',controller:'user',param:[1],action:'get'}
	*/	
	var pathmap = []; 
	AspMvcJs.MvcHandler = function(request,response){
		this.request = request;
		this.response = response;
	};
	AspMvcJs.MvcHandler.prototype.processRequest = function(request){
		return AspMvcJs.Router.processRequest(request);
	};
	AspMvcJs.MvcHandler.prototype.execute = function(){
		function parseParamsToArray(queryString){
			if(queryString.indexOf('&')<0) return [queryString];
			
			var params = queryString.split('&'),result = [];
			for( var i=0,length= params.length;i<length;i++){
				result.push(params.split('=')[1]);
			}
			return result;
		}
		var mvcInstance = this.processRequest(this.request),
			controller = mvcInstance.controller,
			action = mvcInstance.action,
			param = this.parseParamsToArray(mvcInstance.param);
			
		var funargs = arguments;
		if(funargs.length>0){
			if(funargs.length==1){  //only one parameter
				controller = funargs[0];
				action = 'Index';
			}
			else if(funargs.length==2){
				controller = funargs[0];
				action = funargs[1];
			} else{
				controller = funargs[0];
				action = funargs[1];
				param = funargs[2];
			}
			var defaults = {
				viewId:'#'+action,
				appendToElement:'body'
			};
			param  = this.parseParamsToArray($.param(defaults,param||{}));
		}
		if(controller.indexOf(Const.controllerSuffix)<0){
			controller = controller+Const.controllerSuffix;
		}
		var controllerInstance = undefined;
		if(AspMvcJs.Controller.hasOwnProperty(controller))   {
			controllerInstance =  AspMvcJs.Controller[controller];
		}
		if(typeof controllerInstance==="undefined") {
			throw new Error("Can't find the controller");
		}

		if(controllerInstance.hasOwnProperty(action))  {
			var actionCallback = controllerInstance[action];
			if(typeof actionCallback==="function"){
				actionCallback.apply(this,param);
				return;
			}
		}
		throw new Error("Undefined action, Please add action at the controller.");
	};
	
	AspMvcJs.Router = (function(){
		function mvc(mvcParam){
			this.model = mvcParam.model;
			this.view = mvcParam.view;
			this.controller = mvcParam.controller;
			this.action = mvcParam.action;
			this.param = mvcParam.param;			
			this.queryString = mvcParam.queryStrong;
		};
		var parseUrl = function(requestUrl){	
			var url,queryString;
			if(requestUrl.indexOf('?')>0){
				var urlPaths = requestUrl.split('?');
				url = urlPaths[0],
				queryString =urlpaths[1];
			}
			var urlExpr=':controller/:action/:param?id=201&name=test';
			for(var i=0,length=pathmap.length;i<length;i++){
				var currentPathMap = pathmap[i];
				
				if(currentPathMap.url.toLowerCase()==url.toLowerCase()){
					return {
						controller:currentPathMap.controller,
						action:currentPathMap.action,
						param:currentPathMap.param,
						queryString:queryString
					}
				}
			}
			
			var urls = url.split('/'),
			controller = urls[0],action = urls[1],param = urls[2]; //:controller/:action/:param?querystring=
			return {
				action:action,
				controller:controller,
				param:param,
				queryString:queryString
			}
		}
		var processRequest = function(request){
			var requestUrl = request.url,
			     mvcParam = parseUrl(requestUrl);
			
			var mvcInstance = new mvc(mvcParam);
			return mvcInstance;
		
		return {
			processRequest:processRequest
		}
	})()
    /*
    * The core component for the library.
    * controller: Controllers Name (mandatory e.g. HomeController)
    * action: Action Name  (optional e.g: Index, Home. default value is Index)
    * params: the parameters for the action instance   (optional)
     */

	
	AspMvcJs.Match = function(){
		return {
			add: function(url,controller,action){
				pathmap.push({url:url,controller:controller,action:action});
			}
		}
	};
	
    /*
    * Controllers will be only defined at internal, you can define your Controllers and Actions
    * Besides, you can call controller extend method by chain.
     */
    AspMvcJs.Controller = {};
    AspMvcJs.Controller.extend = function(controller){
        $.extend(this,controller);
        return this;
    };

	AspMvcJs.View = (function(){
		return {
			render:function(){
				/*
				* viewId is template for the view and the model is the json data
				* depends on jquery.template
				*/
				var context = arguments[0];
				console.log(context);
				var viewId = context.viewId,
					model = model ||{},
					appendToElement = context.appendToElement;
				console.log(model,viewId,appendToElement);
				if(typeof appendToElement==='undefined')
					appendToElement = 'body';
				if(model.hasOwnProperty(viewId)){
					model = model[viewId];
				}
				if(typeof model==='undefined'){
					throw new Error("No data for the view.");
				}
				var tempElement = $(viewId);
				if(tempElement.length<=0){
					throw new Error("The view ["+viewId+"] does not exist.");
				}
				tempElementtmpl(model).appendTo($(appendToElement));
			}
		}
	}());
	AspMvcJs.Model = {};

    AspMvcJs.Model.extend = function(viewId,model){
        if(!AspMvcJs.Model.hasOwnProperty(viewId)){
            AspMvcJs.Model[viewId] = model;
        }
        return this;
    }

	AspMvcJs.Service = function(){
		return {
			fetch:function(viewId){
				//get the model by the viewId
				var model = AspMvcJs.Model[viewId];
				if(typeof model!="undefined" && model instanceof AspMvcJs.Model.baseModel){
					return model;
				}
				return new Error("Invalid model, please review your model.");
			},
			fetchAll:function(){
				//return array for the result, should be baseModel child type
			},
			saveOrUpdate:function(model){
				return model;
			},
			remove:function(model){
			}
		}
	};

    var htmlHelper = htmlHelper ||{};
    htmlHelper.renderAction = function(requestUrl){
		new AspMvcJs.MvcHandler({url:requestUrl}).execute();
    }
	
    AspMvcJs.htmlHelper =  htmlHelper;
    window.htmlHelper = AspMvcJs.htmlHelper;

    window.AspMvcJs = AspMvcJs;
    if(typeof define==="function" && define.amd && define.amd.AspMvcJs){
        define("AspMvcJs",[],function(){
            return AspMvcJs;
        });
    }
})(window,jQuery)
