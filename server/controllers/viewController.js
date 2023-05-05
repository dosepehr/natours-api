export const overview = (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours',
    });
};
export const tour = (req, res) => {
    res.status(200).render('tour', {
        title: 'All tours',
    });
};

