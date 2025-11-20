document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('searchBtn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        fetch('superheroes.php', { cache: 'no-store' })
            .then(function (res) {
                if (!res.ok) throw new Error('Network response was not ok (' + res.status + ')');
                return res.text();
            })
            .then(function (text) {
                // Try parse as JSON first
                try {
                    var data = JSON.parse(text);
                    if (Array.isArray(data)) {
                        if (data.length === 0) return alert('No superheroes found.');
                        var names = data.map(function (item) {
                            return (typeof item === 'string') ? item : (item && item.name) ? item.name : JSON.stringify(item);
                        });
                        return alert(names.join('\n'));
                    }
                    if (data && Array.isArray(data.superheroes)) {
                        return alert(data.superheroes.join('\n'));
                    }
                } catch (e) {
                }

                var parser = new DOMParser();
                var doc = parser.parseFromString(text, 'text/html');
                var lis = Array.from(doc.querySelectorAll('li'));
                var names = lis.map(function (li) { return li.textContent.trim(); }).filter(function (s) { return s.length; });
                if (names.length === 0) {
                    alert('No superheroes found.');
                } else {
                    alert(names.join('\n'));
                }
            })
            .catch(function (err) {
                alert('Error fetching superheroes: ' + err.message);
            });
    });
});