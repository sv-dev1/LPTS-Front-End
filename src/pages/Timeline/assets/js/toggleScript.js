
	
	   document.addEventListener("DOMContentLoaded", function(event) {

        const showNavbar = (toggleId, navId, bodyId, headerId) =>{
        const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId)
        
        // Validate that all variables exist
        if(toggle && nav && bodypd && headerpd){
        toggle.addEventListener('click', ()=>{
        // show navbar
        nav.classList.toggle('show-sidebar')
        // change icon
        toggle.classList.toggle('bx-x')
        // add padding to body
        bodypd.classList.toggle('body-pd')
        // add padding to header
        headerpd.classList.toggle('body-pd')
        })
        }
        }
        
        showNavbar('header-toggle','nav-bar','body-pd','header')
        
        /*===== LINK ACTIVE =====*/
        const linkColor = document.querySelectorAll('.nav_link')
        
        function colorLink(){
        if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'))
        this.classList.add('active')
        }
        }
        linkColor.forEach(l=> l.addEventListener('click', colorLink))
        
        // Your code to run since DOM is loaded and ready
        });
        
        $("#ReadinessLink").click(function(){
          $("#ReadinessIDSection").show();
          $("#GeometryIDSection").hide();
          $("#AlgebraicIDSection").hide();
        });
        
        $("#GeometryLink").click(function(){
          $("#GeometryIDSection").show();
          $("#ReadinessIDSection").hide();
          $("#AlgebraicIDSection").hide();
        });
        
        $("#AlgebraicLink").click(function(){
          $("#ReadinessIDSection").hide();
          $("#GeometryIDSection").hide();
          $("#AlgebraicIDSection").show();
        });
        
        ////////////////////////////////////////////////////////////////////////
        
        $("#ReadinessLinkDemo").click(function(){
          $("#ReadinessIDSectionDemo").show();
          $("#GeometryIDSectionDemo").hide();
          $("#AlgebraicIDSectionDemo").hide();
        });
        
        $("#GeometryLinkDemo").click(function(){
          $("#GeometryIDSectionDemo").show();
          $("#ReadinessIDSectionDemo").hide();
          $("#AlgebraicIDSectionDemo").hide();
        });
        
        $("#AlgebraicLinkDemo").click(function(){
          $("#ReadinessIDSectionDemo").hide();
          $("#GeometryIDSectionDemo").hide();
          $("#AlgebraicIDSectionDemo").show();
        });
        
        ////////////////////////////////////////////////////////////////////////
        
        $("#ReadinessLinkDemo2").click(function(){
          $("#ReadinessIDSectionDemo2").show();
          $("#GeometryIDSectionDemo2").hide();
          $("#AlgebraicIDSectionDemo2").hide();
        });
        
        $("#GeometryLinkDemo2").click(function(){
          $("#GeometryIDSectionDemo2").show();
          $("#ReadinessIDSectionDemo2").hide();
          $("#AlgebraicIDSectionDemo2").hide();
        });
        
        $("#AlgebraicLinkDemo2").click(function(){
          $("#ReadinessIDSectionDemo2").hide();
          $("#GeometryIDSectionDemo2").hide();
          $("#AlgebraicIDSectionDemo2").show();
        });
        
        /////////////////////////////////////////////////////
        
        $("#ReadinessLinkELA").click(function(){
          $("#ReadinessIDSectionELA").show();
          $("#GeometryIDSectionELA").hide();
          $("#AlgebraicIDSectionELA").hide();
        });
        
        $("#GeometryLinkELA").click(function(){
          $("#GeometryIDSectionELA").show();
          $("#ReadinessIDSectionELA").hide();
          $("#AlgebraicIDSectionELA").hide();
        });
        
        $("#AlgebraicLinkELA").click(function(){
          $("#ReadinessIDSectionELA").hide();
          $("#GeometryIDSectionELA").hide();
          $("#AlgebraicIDSectionELA").show();
        });
        
        /////////////////////////////////////////////////////
        
        $("#ReadinessLinkDemoELA").click(function(){
          $("#ReadinessIDSectionDemoELA").show();
          $("#GeometryIDSectionDemoELA").hide();
          $("#AlgebraicIDSectionDemoELA").hide();
        });
        
        $("#GeometryLinkDemoELA").click(function(){
          $("#GeometryIDSectionDemoELA").show();
          $("#ReadinessIDSectionDemoELA").hide();
          $("#AlgebraicIDSectionDemoELA").hide();
        });
        
        $("#AlgebraicLinkDemoELA").click(function(){
          $("#ReadinessIDSectionDemoELA").hide();
          $("#GeometryIDSectionDemoELA").hide();
          $("#AlgebraicIDSectionDemoELA").show();
        });
        
        ////////////////////////////////////////////////////////////////////////
        
        $("#ReadinessLinkDemo2ELA").click(function(){
          $("#ReadinessIDSectionDemo2ELA").show();
          $("#GeometryIDSectionDemo2ELA").hide();
          $("#AlgebraicIDSectionDemo2ELA").hide();
        });
        
        $("#GeometryLinkDemo2ELA").click(function(){
          $("#GeometryIDSectionDemo2ELA").show();
          $("#ReadinessIDSectionDemo2ELA").hide();
          $("#AlgebraicIDSectionDemoELA2").hide();
        });
        
        $("#AlgebraicLinkDemo2ELA").click(function(){
          $("#ReadinessIDSectionDemo2ELA").hide();
          $("#GeometryIDSectionDemo2ELA").hide();
          $("#AlgebraicIDSectionDemo2ELA").show();
        });
        
        
        $(document).ready(function(){
          $('.subject-list ul li a').click(function(){
            $('.subject-list li a').removeClass("active");
            $(this).addClass("active");
        });
        });
        
            