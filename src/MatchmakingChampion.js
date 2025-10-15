function removeOtherChampion (id)  {
    let $matchmakingChampion = $('#base').find("#otherChampionMatchmaking" + id);

    if (!$matchmakingChampion.length) {
        return
    }

    $matchmakingChampion.remove();
}

function createOtherChampion (id) {
    $('#base').append("<div class=characterChampionMatchmaking id=otherChampionMatchmaking"+id+'></div>');
}

function updateDataMatchmakingChampionOther (data, id) {

    let createData = data.action && data.action == "CREATE";

    if (!createData) {
        return;
    }

    removeOtherChampion(id);

    if (data.wanted) {
        return;
    }

    if (data.matchmaking_champion) {
        createOtherChampion(id);
    }
}

function removeHeroChampion ()  {
    let $matchmakingChampion = $("#heroChampionMatchmaking");

    if (!$matchmakingChampion.length) {
        return
    }

    $matchmakingChampion.remove();
}

function createHeroChampion () {
    $('#base').append("<div class=characterChampionMatchmaking id=heroChampionMatchmaking></div>");
}

function updateDataMatchmakingChampionHero (data) {

    //removeHeroChampion();

    if (isset(data.wanted) && data.wanted) {
        removeHeroChampion();
        return;
    }

    if (isset(data.matchmaking_champion)) {
        if (data.matchmaking_champion) createHeroChampion();
        else removeHeroChampion();
    }
}

