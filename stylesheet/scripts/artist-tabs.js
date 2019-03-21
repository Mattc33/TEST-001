<script>

$('#artist-tab-group a').click(function (e) {
  e.preventDefault()
  $(this).tab('show');
})

$('#artist-tab-group a[href="#swat"]').tab('show');
$('#artist-tab-group a[href="#artistcal"]').tab('show');
$('#artist-tab-group a[href="#timeline"]').tab('show');
$('#artist-tab-group a[href="#artistfiles"]').tab('show');
$('#artist-tab-group a[href="#finalassets"]').tab('show');
</script>