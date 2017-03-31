aspmvcjs
========

terry repositiry The usage of the Javascript
<html>
	<head>
		<title>Javascript Model Showcase</title>

	</head>
	<body>
        <div id="divShow">

        </div>
		<script id="divResult" type="text/html">
            <span>Id:${id}</span>
            <span>Name:${name}</span>
        </script>
	</body>
</html>
<script type="text/javascript" src="app/lib/jquery.js"></script>
<script type="text/javascript" src="app/lib/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="app/lib/aspmvcjs.js"></script>

<script type="text/javascript">
    AspMvcJs.Controller.extend({
        HomeController:{
            Index:function(context){
               AspMvcJs.View.render(context);
            },
	    Home: function(context){
		var templateId = context.viewId;

                var rootId = context.appendToElement;
                var model = AspMvcJs.Model.extend(templateId,{
                    id:'111',
                    name:'Terry Zhang'
                });
                AspMvcJs.View.render(templateId,model,rootId);
	    }
        }
    });

    htmlHelper.renderAction("Home","Index");
    htmlHelper.renderAction("Home","Home",{viewId:'#divResult',appendToElement:'#divShow'});
</script>
