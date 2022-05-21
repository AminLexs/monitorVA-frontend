export const searchNameFunc = (searchColumn=1) => {
  let input, filter, table, tr, td, i;
  input = document.getElementById('searchInput') as HTMLInputElement;
  filter = input!.value.toUpperCase();
  table = document.getElementById('table');
  tr = table!.getElementsByTagName('tr');
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[searchColumn];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
};

export const sortTable = (indexHeading: number, reverse = false) => {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById('table')!;
  switching = true;

  while (switching) {
    switching = false;
    rows = table.getElementsByTagName('tr');
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName('td')[indexHeading];
      y = rows[i + 1].getElementsByTagName('td')[indexHeading];
      /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
      if (reverse) {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
};
