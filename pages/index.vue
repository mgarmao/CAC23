<template>
    <div>
        <div id="header">
            <div id="profile-btn"><img src="../public/user-solid.svg" alt="profile" id="profile-icon"></div>
        </div>
        <br>
        <div id="body1">
            <div id="body1-words">
                <div id="monthly-statement">> Monthly Expenses: ${{price}} </div>
                <div id="tracking-statement">Currently On Track To Stay On Budget</div>
                <br>
                <div id="spending-insight">Your spending is up 5% compared to this time last month</div>
            </div>
        </div> 

        <div id="tabs-menu" class="noSelect">

            <NuxtLink to="/tracker">
                <div class="tab">
                    <img src="../public/tabs-icon/chart-line-solid.svg" alt="tracker" class="tab-icon">
                    <div class="tab-header">Tracker</div>
                </div>
            </NuxtLink>

            <NuxtLink to="/calculator">
                <div class="tab">
                    <img src="../public/tabs-icon/calculator-solid.svg" alt="calculators" class="tab-icon">
                    <div class="tab-header">Calculators</div>
                </div>
            </NuxtLink>

            <NuxtLink to="/tracker">
                <div class="tab">
                    <img src="../public/tabs-icon/book-open-solid.svg" alt="articles" class="tab-icon">
                    <div class="tab-header">Articles</div>
                </div>
            </NuxtLink>
        </div>

        <div id="articles">
            <div id="articles-header">Top Articles</div>
            <div id="article-options">
                <div class="article" id="1">
                    <img src="" alt="">
                    <div id="headline">What is Compound Interest?</div>
                </div>

                <div class="article" id="2">
                    <img src="" alt="">
                    <div id="headline">How to turn your Lincolns into Benjamins</div>
                </div>
                
                <div class="article" id="3">
                    <img src="" alt="">
                    <div id="headline">What to watch for in the market this year</div>
                </div>
                
                <div class="article" id="4">
                    <img src="" alt="">
                    <div id="headline">History of Wall Street</div>
                </div>

                <!-- <div class="article" id="5">
                    <img src="" alt="">
                    <div id="headline">History of Wall Street Bets</div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
    const price = ref(700)
</script>

<style>
    body{
        transition: all ease 0.5s;
        background-color: #121212;
        color: #FFF;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    #header{
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(180deg, rgba(187, 134, 252, 0.00) 0%, #2A404B 16.67%, rgba(64, 64, 64, 0.00) 100%);
        padding: 10px;
    }

    #profile-btn{
        margin-left: auto;
    }
    
    #profile-icon{
        width: 30px;
        height: 33.333px;
    }

    a{
        text-decoration: none;
    }

    .noSelect {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .noSelect:focus {
        outline: none !important;
    }

</style>

<style scoped>
    #monthly-statement{
        font-size: 20px;
    }

    #tracking-statement{
        font-size: 15px;
    }

    #spending-insight{
        font-size: 15px;
    }

    #body1{
        border-radius: 20px;
        background: #1E1E1E; 
        padding-top:1rem;
        padding-bottom:3rem;
    }

    #body1-words{
        margin-left:2rem;
    }

    #tabs-menu{
        display: grid;
        padding-bottom: 1rem;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 1rem;
    }

    .tab {
        border-radius: 20px;
        background: #1E1E1E;
        display: flex;
        flex-direction: column; 
        align-items: center;
    }

    .tab:hover{
        background: #2e2e2e;
        transition: all 0.5s;
    }

    .tab-header {
        margin-top: 10px;
        margin-bottom: 10px; 
        color:#A8A8A8;
        text-align: center;
    }

    .tab-icon {
        display: block;
        width: 73px; 
        height: 56px; 
        margin-top: 10px; 
    }
    
    #articles{
        border-radius: 20px;
        margin-top: 0.5rem;
        background: #2A404B;
    }

    #articles-header{
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
                
        padding-bottom: 1rem;
        margin-left: 1rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        display: inline-block;
    }

    #article-options{
        display: grid;
        padding-bottom: 1rem;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        justify-items: center;
    }
    
    .article{
        font-size: 13px;

        border-radius: 10px;
        width: 144px;
        background-color: #314A55;
        padding-bottom: 1rem;
    }

    #headline{
        margin-left: 0.5rem;
    }
</style>