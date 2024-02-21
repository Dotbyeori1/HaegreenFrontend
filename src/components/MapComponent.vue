<template>
  <div id="map" style="max-width:950px; min-height: 350px; margin: 20px auto 20px auto;"></div>
</template>

<script>
export default {
  name : "MapComponent",
  mounted() {
    const script = document.createElement('script');
    script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=vn3ftqrnmy"
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);

    script.onload = () => {
      let map = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(33.450701, 126.570667),
        level: 3,
        locationButtonEnabled: true,
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.RIGHT_CENTER
        }
      });

      //let address = "전라남도 여수시 신월동 120-46";
      let name = "해그린피싱";
      let coords = new window.naver.maps.LatLng(34.7224132, 127.7076481);

      let marker = new window.naver.maps.Marker({
        position: coords,
        map: map
      });

      let infowindow = new window.naver.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:6px 0;">' + name + '</div>'
      });

      infowindow.open(map, marker);

      map.setCenter(coords);
    };
  },
}
</script>