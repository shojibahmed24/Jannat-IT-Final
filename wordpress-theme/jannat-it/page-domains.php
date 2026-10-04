<?php
/**
 * Template Name: Domains Page
 */

get_header(); ?>

<main class="py-20 lg:py-32">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
            <h1 class="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter">Find Your Perfect Domain</h1>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Secure your online identity with our fast and easy domain registration service.
            </p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-3xl mx-auto mb-20">
            <div class="relative group">
                <input 
                    type="text" 
                    id="domain-search-input"
                    placeholder="Search for your dream domain (e.g. jannatit.com)" 
                    class="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-xl text-white focus:outline-none focus:border-orange-500/50 transition-all shadow-2xl"
                />
                <button 
                    id="domain-search-btn"
                    class="absolute right-4 top-1/2 -translate-y-1/2 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all flex items-center gap-2 shadow-xl shadow-orange-600/30 uppercase tracking-widest text-xs"
                >
                    <i data-lucide="search" class="w-5 h-5"></i>
                    Search
                </button>
            </div>
            
            <div id="domain-results" class="hidden mt-8"></div>

            <div class="mt-12 flex flex-wrap justify-center gap-8 text-sm">
                <div class="flex items-center gap-2 text-slate-500">
                    <span class="font-bold text-white text-lg">.com</span>
                    <span class="font-medium">$9.99</span>
                    <span class="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Sale</span>
                </div>
                <div class="flex items-center gap-2 text-slate-500">
                    <span class="font-bold text-white text-lg">.net</span>
                    <span class="font-medium">$12.99</span>
                </div>
                <div class="flex items-center gap-2 text-slate-500">
                    <span class="font-bold text-white text-lg">.org</span>
                    <span class="font-medium">$13.99</span>
                </div>
                <div class="flex items-center gap-2 text-slate-500">
                    <span class="font-bold text-white text-lg">.io</span>
                    <span class="font-medium">$34.99</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div class="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
                <i data-lucide="shield" class="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform"></i>
                <h3 class="text-xl font-bold text-white mb-4 tracking-tight">WHOIS Privacy</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Keep your personal contact information hidden from the public WHOIS database for free.</p>
            </div>
            <div class="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
                <i data-lucide="zap" class="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform"></i>
                <h3 class="text-xl font-bold text-white mb-4 tracking-tight">Instant Activation</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Your domain is registered and ready to use immediately after checkout.</p>
            </div>
            <div class="p-10 rounded-[2.5rem] glass-card border-white/5 text-center group hover:border-orange-500/30 transition-all">
                <i data-lucide="globe" class="w-12 h-12 text-orange-500 mx-auto mb-8 group-hover:scale-110 transition-transform"></i>
                <h3 class="text-xl font-bold text-white mb-4 tracking-tight">DNS Management</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Easy-to-use control panel to manage your A, MX, CNAME, and TXT records.</p>
            </div>
        </div>

        <!-- Domain Pricing Table -->
        <div class="mt-20 overflow-hidden rounded-[2.5rem] border border-white/5 glass-card">
            <div class="px-10 py-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h2 class="text-2xl font-black text-white tracking-tight">Domain Extension Pricing</h2>
                <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Updates</div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <th className="px-10 py-6">Extension</th>
                            <th className="px-10 py-6">Registration</th>
                            <th className="px-10 py-6">Renewal</th>
                            <th className="px-10 py-6">Transfer</th>
                            <th className="px-10 py-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="text-slate-300">
                        <?php 
                        $tlds = [
                            ['tld' => '.com', 'price' => '$9.99'],
                            ['tld' => '.net', 'price' => '$11.99'],
                            ['tld' => '.org', 'price' => '$12.99'],
                            ['tld' => '.io', 'price' => '$34.99'],
                            ['tld' => '.xyz', 'price' => '$1.99'],
                            ['tld' => '.dev', 'price' => '$14.99'],
                        ];
                        foreach ($tlds as $item) : 
                        ?>
                        <tr class="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td class="px-10 py-8 font-black text-white text-xl"><?php echo $item['tld']; ?></td>
                            <td class="px-10 py-8 font-bold"><?php echo $item['price']; ?></td>
                            <td class="px-10 py-8 font-bold"><?php echo $item['price']; ?></td>
                            <td class="px-10 py-8 font-bold"><?php echo $item['price']; ?></td>
                            <td class="px-10 py-8 text-right">
                                <a href="#" class="px-6 py-2 bg-white/5 hover:bg-orange-600 hover:text-white text-slate-400 font-black rounded-xl transition-all inline-block uppercase tracking-widest text-[10px]">Register</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('domain-search-btn');
    const searchInput = document.getElementById('domain-search-input');
    const resultsDiv = document.getElementById('domain-results');

    searchBtn.addEventListener('click', function() {
        const domain = searchInput.value.trim();
        if (!domain) return;

        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Searching...';
        lucide.createIcons();

        const formData = new FormData();
        formData.append('action', 'domain_search');
        formData.append('domain', domain);

        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.redirect_url) {
                window.location.href = data.data.redirect_url;
            } else {
                alert('Error: ' + (data.data || 'Something went wrong'));
                searchBtn.disabled = false;
                searchBtn.innerHTML = '<i data-lucide="search" class="w-5 h-5"></i> Search';
                lucide.createIcons();
            }
        });
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchBtn.click();
    });
});
</script>

<?php get_footer(); ?>
