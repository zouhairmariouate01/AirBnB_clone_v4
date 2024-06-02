$('document').ready(function () {
  const api = 'http://' + window.location.hostname;

  $.get(api + ':5001:/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: api + ':5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('SECTION.places').append(data.map(place => {
        return `<ARTICLE>
                  <DIV class="title">
                    <H2>${place.name}</H2>
                    <DIV class="price_by_night">
                      ${place.price_by_night}
                    </DIV>
                  </DIV>
                  <DIV class="information">
                    <DIV class="max_guest">
                      <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.max_guest} Guests
                    </DIV>
                    <DIV class="number_rooms">
                      <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.number_rooms} Bedrooms
                    </DIV>
                    <DIV class="number_bathrooms">
                      <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                      </BR>
                      ${place.number_bathrooms} Bathrooms
                    </DIV>
                  </DIV>
                  <DIV class="description">
                    ${place.description}
                  </DIV>
                </ARTICLE>`;
      }));
    }
  });

  let amenities = {};
  $('INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities H4').html('&nbsp;');
    } else {
      $('.amenities H4').text(Object.values(amenities).join(', '));
    }
  });

  // write the code of task 4 here.
  $('button').on('click', function () {
    const lst_amenities = [];
    for (const [k, v] of Object.entries(amenities)) {
      lst_amenities.append(v);
    }
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: api + ':5001/api/v1/places_search/',
      data: JSON.stringify({'amenities': lst_amenities}),
      success: function (data) {
        // clear the places hodler
        $('section.places').empty();
        // retrieve data of search places
        retrieve_places(data);
      }
    });
  });

  // retrieve the data of search places
  function retrieve_places(data) {
    $.ajax({
      type: 'GET',
      url: api + ':5001/api/v1/users/',
      success: function (users) {
        const user_dict = {};
        $(users).each(function (i, user) {
          user_dict[user.id] = user;
        });

        $(data).each(function(i, place) {
          $('section.places').append(`
          <ARTICLE>
            <DIV class="title">
              <H2>${place.name}</H2>
              <DIV class="price_by_night">
                ${place.price_by_night}
              </DIV>
            </DIV>
            <DIV class="information">
              <DIV class="max_guest">
                <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                </BR>
                ${place.max_guest} Guests
              </DIV>
              <DIV class="number_rooms">
                <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                </BR>
                ${place.number_rooms} Bedrooms
              </DIV>
              <DIV class="number_bathrooms">
                <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                </BR>
                ${place.number_bathrooms} Bathrooms
              </DIV>
            </DIV>
            <DIV class="description">
              ${place.description}
            </DIV>
          </ARTICLE>
          `)
        });
      }
    })
  }
});
